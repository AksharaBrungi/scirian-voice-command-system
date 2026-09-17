import React, { useState, useEffect } from 'react';
import {
  AllowedIntent,
  BookItem,
  ChatMessage,
  CommandParameters,
  FlashcardItem,
  NoteItem,
  PageTab,
  StudyTask,
  VoiceCommandContext,
  VoiceCommandResult,
  VoiceState,
} from './types';
import {
  INITIAL_PROFILE,
  INITIAL_TASKS,
  INITIAL_NOTES,
  INITIAL_COMMAND_HISTORY,
  INITIAL_BOOKS,
  INITIAL_FLASHCARDS,
  INITIAL_CHAT_HISTORY,
} from './data/mockData';
import { speechService, resolveIntent, ALLOWED_INTENTS } from './services/voiceService';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { StudyPlanView } from './components/StudyPlanView';
import { QuizView } from './components/QuizView';
import { NotesView } from './components/NotesView';
import { AnalyticsView } from './components/AnalyticsView';
import { LibraryView } from './components/LibraryView';
import { BookReaderView } from './components/BookReaderView';
import { AITutorView } from './components/AITutorView';
import { DailyRecallView } from './components/DailyRecallView';
import { LandingView } from './components/LandingView';
import { GlobalVoiceAssistant } from './components/GlobalVoiceAssistant';
import { VoiceCommandsModal } from './components/VoiceCommandsModal';
import { Menu, X, Sparkles, Volume2 } from 'lucide-react';

export default function App() {
  // Authentication / Landing gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('scirian_auth') === 'true';
  });

  // Navigation
  const [currentTab, setCurrentTab] = useState<PageTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Application Data State
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('scirian_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('scirian_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [books, setBooks] = useState<BookItem[]>(() => {
    const saved = localStorage.getItem('scirian_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [selectedBookId, setSelectedBookId] = useState<string>(() => {
    return INITIAL_BOOKS[0].id;
  });

  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(() => {
    const saved = localStorage.getItem('scirian_flashcards');
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
  });

  const [tutorMessages, setTutorMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('scirian_tutor_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_HISTORY;
  });
  const [isTutorProcessing, setIsTutorProcessing] = useState(false);

  const [commandHistory, setCommandHistory] = useState<VoiceCommandResult[]>(() => {
    const saved = localStorage.getItem('scirian_command_history');
    return saved ? JSON.parse(saved) : INITIAL_COMMAND_HISTORY;
  });

  const [profile] = useState(INITIAL_PROFILE);

  // Voice Interaction State
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastIntent, setLastIntent] = useState<AllowedIntent | undefined>(undefined);
  const [lastParameters, setLastParameters] = useState<CommandParameters | undefined>(undefined);
  const [lastConfidence, setLastConfidence] = useState<number>(0.95);
  const [lastActionSummary, setLastActionSummary] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Cross-Module Trigger States
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [quizParams, setQuizParams] = useState<{ subject: string; questionCount: number }>({
    subject: 'Python',
    questionCount: 10,
  });
  const [studyPlanPrefill, setStudyPlanPrefill] = useState('');
  const [autoSummarizeNotes, setAutoSummarizeNotes] = useState(false);

  // Voice triggers for reader & recall
  const [explainTrigger, setExplainTrigger] = useState(0);
  const [summarizeTrigger, setSummarizeTrigger] = useState(0);
  const [flipTrigger, setFlipTrigger] = useState(0);
  const [nextRecallTrigger, setNextRecallTrigger] = useState(0);
  const [masteredRecallTrigger, setMasteredRecallTrigger] = useState(0);

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem('scirian_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('scirian_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('scirian_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('scirian_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('scirian_tutor_messages', JSON.stringify(tutorMessages));
  }, [tutorMessages]);

  useEffect(() => {
    localStorage.setItem('scirian_command_history', JSON.stringify(commandHistory));
  }, [commandHistory]);

  const activeBook = books.find((b) => b.id === selectedBookId) || books[0];

  // Current voice command context
  const currentVoiceContext: VoiceCommandContext = {
    activeTab: currentTab,
    currentBookId: activeBook?.id,
    currentBookTitle: activeBook?.title,
    currentChapterTitle: activeBook?.chapters[0]?.title,
  };

  // Audio Speech Synthesis feedback
  const announceFeedback = (text: string) => {
    if ('speechSynthesis' in window && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        utterance.volume = 0.6;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        // silent fallback
      }
    }
  };

  /**
   * CORE COMMAND ROUTER & APPLICATION ACTION EXECUTOR
   * Translates validated intent & parameters into concrete module navigation and state updates.
   */
  const executeCommand = (
    spokenTranscript: string,
    intent: AllowedIntent,
    confidence: number,
    parameters: CommandParameters,
    source: 'rule_engine' | 'gemini_nlu' | 'manual_test' | 'fallback' = 'gemini_nlu'
  ) => {
    let actionDesc = '';
    let executedSuccessfully = true;

    switch (intent) {
      case 'GO_HOME':
        setCurrentTab('dashboard');
        actionDesc = 'Navigated to Dashboard';
        announceFeedback('Opening Dashboard');
        break;

      case 'OPEN_LIBRARY':
        setCurrentTab('library');
        actionDesc = 'Opened My Library';
        announceFeedback('Opening your learning library');
        break;

      case 'CONTINUE_READING':
        setCurrentTab('reader');
        actionDesc = `Resumed reading ${activeBook.title}`;
        announceFeedback(`Resuming ${activeBook.title}`);
        break;

      case 'EXPLAIN_SECTION':
        setCurrentTab('reader');
        setExplainTrigger((prev) => prev + 1);
        actionDesc = 'Requested AI Copilot section explanation';
        announceFeedback('Analyzing and explaining this section');
        break;

      case 'SUMMARIZE_PAGE':
        setCurrentTab('reader');
        setSummarizeTrigger((prev) => prev + 1);
        actionDesc = 'Synthesizing chapter summary';
        announceFeedback('Synthesizing chapter key takeaways');
        break;

      case 'NEXT_PAGE':
        if (currentTab !== 'reader') setCurrentTab('reader');
        actionDesc = 'Advanced to next chapter';
        announceFeedback('Next chapter');
        break;

      case 'PREVIOUS_PAGE':
        if (currentTab !== 'reader') setCurrentTab('reader');
        actionDesc = 'Turned to previous chapter';
        announceFeedback('Previous chapter');
        break;

      case 'OPEN_AI_TUTOR':
        setCurrentTab('ai-tutor');
        actionDesc = 'Connected to AI Voice Tutor';
        announceFeedback('Connecting to your AI Tutor');
        break;

      case 'REVIEW_DAILY_RECALL':
        setCurrentTab('daily-recall');
        actionDesc = 'Opened Daily Recall spaced repetition';
        announceFeedback('Opening Daily Recall');
        break;

      case 'SHOW_ANSWER':
        if (currentTab !== 'daily-recall') setCurrentTab('daily-recall');
        setFlipTrigger((prev) => prev + 1);
        actionDesc = 'Flipped active flashcard';
        announceFeedback('Flipping card');
        break;

      case 'NEXT_FLASHCARD':
        if (currentTab !== 'daily-recall') setCurrentTab('daily-recall');
        setNextRecallTrigger((prev) => prev + 1);
        actionDesc = 'Next flashcard loaded';
        announceFeedback('Next card');
        break;

      case 'MARK_MASTERED':
        if (currentTab !== 'daily-recall') setCurrentTab('daily-recall');
        setMasteredRecallTrigger((prev) => prev + 1);
        actionDesc = 'Marked card as mastered';
        announceFeedback('Marked as mastered');
        break;

      case 'OPEN_STUDY_PLAN':
      case 'SHOW_STUDY_PLAN':
        setCurrentTab('study-plan');
        actionDesc = 'Navigated to Study Plan';
        announceFeedback('Opening Study Plan');
        break;

      case 'CREATE_STUDY_PLAN':
        setCurrentTab('study-plan');
        if (parameters.taskTitle) {
          setStudyPlanPrefill(parameters.taskTitle);
          actionDesc = `Opened Study Plan with task '${parameters.taskTitle}'`;
          announceFeedback(`Planning study task for ${parameters.taskTitle}`);
        } else {
          actionDesc = 'Opened Study Plan creator';
          announceFeedback('Creating study plan');
        }
        break;

      case 'START_QUIZ':
        const subject = parameters.subject || 'Python';
        const questionCount = parameters.questionCount || 10;
        setQuizParams({ subject, questionCount });
        setCurrentTab('quiz');
        actionDesc = `Configured & opened ${subject} Quiz (${questionCount} questions)`;
        announceFeedback(`Starting ${subject} quiz with ${questionCount} questions`);
        break;

      case 'OPEN_NOTES':
        setCurrentTab('notes');
        setAutoSummarizeNotes(false);
        actionDesc = 'Navigated to Study Notes';
        announceFeedback('Opening Study Notes');
        break;

      case 'SUMMARIZE_NOTES':
        setCurrentTab('notes');
        setAutoSummarizeNotes(true);
        actionDesc = 'Navigated to Notes & triggered AI Summarizer';
        announceFeedback('Synthesizing your study notes');
        break;

      case 'OPEN_ANALYTICS':
        setCurrentTab('analytics');
        actionDesc = 'Navigated to Student Analytics';
        announceFeedback('Opening Analytics');
        break;

      case 'SHOW_HELP':
        setIsHelpOpen(true);
        actionDesc = 'Opened Voice Command Guide';
        announceFeedback('Here are the available voice commands');
        break;

      case 'UNKNOWN':
      default:
        executedSuccessfully = false;
        actionDesc = 'Unrecognized command';
        break;
    }

    // Format current time
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Record into Command History
    const historyItem: VoiceCommandResult = {
      id: `cmd-${Date.now()}`,
      transcript: spokenTranscript,
      intent,
      confidence,
      parameters,
      actionSummary: actionDesc,
      timestamp: timeStr,
      source,
      status: executedSuccessfully ? 'executed' : 'rejected',
    };

    setCommandHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
    setLastIntent(intent);
    setLastParameters(parameters);
    setLastConfidence(confidence);
    setLastActionSummary(actionDesc);

    if (executedSuccessfully) {
      setVoiceState('result');
    } else {
      setErrorMessage(
        `Could not recognize "${spokenTranscript}". Try: "Open my library", "Explain this section", "Start a Python quiz", or "Review daily recall".`
      );
      setVoiceState('error');
    }
  };

  /**
   * Process recognized or submitted text through the Natural Language Understanding pipeline
   */
  const processTranscript = async (
    rawText: string,
    source: 'rule_engine' | 'gemini_nlu' | 'manual_test' = 'gemini_nlu'
  ) => {
    if (!rawText.trim()) return;

    setTranscript(rawText);
    setInterimTranscript('');
    setVoiceState('processing');

    try {
      const result = await resolveIntent(rawText, currentVoiceContext);

      // Validate intent is strictly allowed
      if (ALLOWED_INTENTS.includes(result.intent) && result.confidence >= 0.5) {
        executeCommand(
          rawText,
          result.intent,
          result.confidence,
          result.parameters,
          result.source || source
        );
      } else {
        // Unknown or low confidence
        executeCommand(rawText, 'UNKNOWN', result.confidence, {}, 'fallback');
      }
    } catch (err: any) {
      console.error('Command processing error:', err);
      setErrorMessage('Network or server error during intent classification.');
      setVoiceState('error');
    }
  };

  // Start microphone recording
  const startListening = () => {
    setVoiceState('listening');
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage('');

    const started = speechService.startListening({
      onInterim: (interim) => {
        setInterimTranscript(interim);
      },
      onFinal: (finalText) => {
        processTranscript(finalText);
      },
      onError: (errMessage) => {
        setErrorMessage(errMessage);
        setVoiceState('error');
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      },
    });

    if (!started) {
      setVoiceState('error');
    }
  };

  // Stop microphone recording
  const stopListening = () => {
    speechService.stopListening();
    if (interimTranscript.trim()) {
      processTranscript(interimTranscript.trim());
    } else {
      setVoiceState('idle');
    }
  };

  // Task Actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTaskData: Omit<StudyTask, 'id' | 'completed'>) => {
    const task: StudyTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Note Actions
  const handleSaveNote = (updatedNote: NoteItem) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === updatedNote.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedNote;
        return next;
      }
      return [updatedNote, ...prev];
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Flashcard toggle
  const handleToggleMastered = (cardId: string) => {
    setFlashcards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, mastered: !c.mastered } : c))
    );
  };

  // AI Tutor message send
  const handleSendTutorMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setTutorMessages((prev) => [...prev, userMsg]);
    setIsTutorProcessing(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: tutorMessages.slice(-6),
          bookContext: activeBook ? `${activeBook.title} - ${activeBook.chapters[0]?.title}` : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `m-${Date.now() + 1}`,
          role: 'assistant',
          content: data.reply || 'Let me help you understand that concept.',
          timestamp: 'Just now',
        };
        setTutorMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        role: 'assistant',
        content: `In distributed systems and ${activeBook?.category || 'computer science'}, this depends heavily on your consistency and partition tolerance requirements. Let's analyze the trade-off step by step.`,
        timestamp: 'Just now',
      };
      setTutorMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTutorProcessing(false);
    }
  };

  // Authentication Gate: Render Landing/Welcome screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <LandingView
        onLoginDemo={() => {
          setIsAuthenticated(true);
          sessionStorage.setItem('scirian_auth', 'true');
        }}
        onOpenVoiceGuide={() => setIsHelpOpen(true)}
        profile={profile}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex shrink-0">
        <Navigation
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setAutoSummarizeNotes(false);
          }}
          profile={profile}
          onOpenHelp={() => setIsHelpOpen(true)}
          voiceActive={voiceState === 'listening'}
          onSignOut={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem('scirian_auth');
          }}
          contextTitle={
            currentTab === 'reader'
              ? `Reading: ${activeBook?.title.slice(0, 20)}...`
              : currentTab === 'library'
              ? 'Library Shelf'
              : currentTab === 'daily-recall'
              ? 'Spaced Recall'
              : undefined
          }
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
              <Sparkles className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight">Scirian</span>
              <span className="text-[10px] uppercase font-bold text-indigo-400 ml-1.5 px-1.5 py-0.5 rounded bg-indigo-500/20">
                Voice OS
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
              title="Voice Commands Guide"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {(
              [
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'library', label: 'My Library' },
                { id: 'reader', label: 'Book Reader' },
                { id: 'ai-tutor', label: 'AI Voice Tutor' },
                { id: 'daily-recall', label: 'Daily Recall' },
                { id: 'study-plan', label: 'Study Plan' },
                { id: 'quiz', label: 'Practice Quiz' },
                { id: 'notes', label: 'Study Notes' },
                { id: 'analytics', label: 'Analytics' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  currentTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic View Display */}
        <main className="flex-1 pb-16">
          {currentTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              tasks={tasks}
              books={books}
              flashcards={flashcards}
              commandHistory={commandHistory}
              voiceState={voiceState}
              transcript={transcript}
              interimTranscript={interimTranscript}
              lastIntent={lastIntent}
              lastParameters={lastParameters}
              lastConfidence={lastConfidence}
              lastActionSummary={lastActionSummary}
              errorMessage={errorMessage}
              audioLevel={audioLevel}
              onStartListening={startListening}
              onStopListening={stopListening}
              onSubmitCommand={(text) => processTranscript(text, 'manual_test')}
              onNavigateTab={(tab) => {
                setCurrentTab(tab);
                setAutoSummarizeNotes(false);
              }}
              onSelectBook={(bookId) => {
                setSelectedBookId(bookId);
                setCurrentTab('reader');
              }}
              onToggleTask={handleToggleTask}
              onOpenHelp={() => setIsHelpOpen(true)}
              onResetVoice={() => {
                setVoiceState('idle');
                setTranscript('');
                setInterimTranscript('');
                setErrorMessage('');
              }}
            />
          )}

          {currentTab === 'library' && (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
              <LibraryView
                books={books}
                onSelectBook={(bookId) => {
                  setSelectedBookId(bookId);
                  setCurrentTab('reader');
                }}
                onAddBook={(newBook) => {
                  setBooks((prev) => [newBook, ...prev]);
                  setSelectedBookId(newBook.id);
                  setCurrentTab('reader');
                }}
                onVoicePromptClick={(text) => processTranscript(text, 'manual_test')}
              />
            </div>
          )}

          {currentTab === 'reader' && (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
              <BookReaderView
                book={activeBook}
                onBackToLibrary={() => setCurrentTab('library')}
                onLaunchQuizFromBook={(subj, count) => {
                  setQuizParams({ subject: subj, questionCount: count });
                  setCurrentTab('quiz');
                }}
                onAddNoteFromReader={(title, content, subj) => {
                  const newNote: NoteItem = {
                    id: `note-${Date.now()}`,
                    title,
                    content,
                    subject: subj,
                    updatedAt: 'Just now',
                    tags: ['Reader Copilot', subj],
                    bookRef: activeBook?.title,
                  };
                  setNotes((prev) => [newNote, ...prev]);
                  setCurrentTab('notes');
                }}
                onVoicePromptClick={(text) => processTranscript(text, 'manual_test')}
                explainTrigger={explainTrigger}
                summarizeTrigger={summarizeTrigger}
              />
            </div>
          )}

          {currentTab === 'ai-tutor' && (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
              <AITutorView
                messages={tutorMessages}
                onSendMessage={handleSendTutorMessage}
                isProcessing={isTutorProcessing}
                activeBook={activeBook}
                onVoicePromptClick={(text) => processTranscript(text, 'manual_test')}
              />
            </div>
          )}

          {currentTab === 'daily-recall' && (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
              <DailyRecallView
                flashcards={flashcards}
                onToggleMastered={handleToggleMastered}
                onVoicePromptClick={(text) => processTranscript(text, 'manual_test')}
                flipTrigger={flipTrigger}
                nextTrigger={nextRecallTrigger}
                masteredTrigger={masteredRecallTrigger}
              />
            </div>
          )}

          {currentTab === 'study-plan' && (
            <StudyPlanView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onVoiceAddPrompt={() => startListening()}
              prefilledTitle={studyPlanPrefill}
            />
          )}

          {currentTab === 'quiz' && (
            <QuizView
              initialSubject={quizParams.subject}
              initialQuestionCount={quizParams.questionCount}
              onRecordResult={(subj, score, total) => {
                console.log(`Quiz completed: ${subj} ${score}/${total}`);
              }}
              onVoiceTriggerPrompt={() => startListening()}
            />
          )}

          {currentTab === 'notes' && (
            <NotesView
              notes={notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onVoiceSummarizePrompt={() => startListening()}
              autoSummarizeTrigger={autoSummarizeNotes}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              profile={profile}
              completedTasksCount={tasks.filter((t) => t.completed).length}
              totalTasksCount={tasks.length}
              onVoiceTriggerPrompt={() => startListening()}
            />
          )}
        </main>
      </div>

      {/* Global Floating Voice Assistant on All Screens */}
      <GlobalVoiceAssistant
        voiceState={voiceState}
        transcript={transcript}
        interimTranscript={interimTranscript}
        lastIntent={lastIntent}
        lastParameters={lastParameters}
        lastActionSummary={lastActionSummary}
        audioLevel={audioLevel}
        errorMessage={errorMessage}
        context={currentVoiceContext}
        onStartListening={startListening}
        onStopListening={stopListening}
        onSubmitCommand={(text) => processTranscript(text, 'manual_test')}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Voice Commands Guide Modal */}
      <VoiceCommandsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onSelectPrompt={(promptText) => processTranscript(promptText, 'manual_test')}
      />
    </div>
  );
}
