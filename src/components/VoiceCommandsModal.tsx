import React from 'react';
import { X, Mic, CheckCircle2, ShieldCheck, Terminal, ArrowRight, BookOpen, Brain, Bot } from 'lucide-react';
import { AllowedIntent } from '../types';

interface VoiceCommandsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string) => void;
}

interface CommandGuideItem {
  intent: AllowedIntent;
  category: 'Library & Reader' | 'AI Tutor & Recall' | 'Core Productivity';
  description: string;
  examples: string[];
  parameters: string;
  action: string;
}

export const VoiceCommandsModal: React.FC<VoiceCommandsModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  if (!isOpen) return null;

  const commandsList: CommandGuideItem[] = [
    // Library & Reader Context
    {
      intent: 'OPEN_LIBRARY',
      category: 'Library & Reader',
      description: 'Open your digital textbook and research paper library.',
      examples: ['"Open my library"', '"Go to library"', '"Show my textbooks"'],
      parameters: 'None',
      action: 'Navigates to My Library workspace',
    },
    {
      intent: 'CONTINUE_READING',
      category: 'Library & Reader',
      description: 'Resume reading your current book at the last visited page.',
      examples: ['"Continue reading"', '"Resume reading"', '"Open book reader"'],
      parameters: 'bookTitle (optional)',
      action: 'Launches Book Reader at saved progress',
    },
    {
      intent: 'EXPLAIN_SECTION',
      category: 'Library & Reader',
      description: 'Context-aware AI breakdown with analogies and key concepts while reading.',
      examples: ['"Explain this section"', '"Explain this concept"', '"Break down this chapter"'],
      parameters: 'None (reads active chapter text)',
      action: 'Triggers AI Copilot section explanation in Book Reader',
    },
    {
      intent: 'SUMMARIZE_PAGE',
      category: 'Library & Reader',
      description: 'Synthesize executive summary and key takeaways of the current chapter.',
      examples: ['"Summarize this page"', '"Summarize this chapter"'],
      parameters: 'None (reads active page text)',
      action: 'Triggers AI Copilot chapter summarization in Book Reader',
    },
    {
      intent: 'NEXT_PAGE',
      category: 'Library & Reader',
      description: 'Hands-free page/chapter flipping while studying.',
      examples: ['"Next page"', '"Next chapter"', '"Previous page"'],
      parameters: 'None',
      action: 'Advances or rewinds the Book Reader',
    },

    // AI Tutor & Recall
    {
      intent: 'OPEN_AI_TUTOR',
      category: 'AI Tutor & Recall',
      description: 'Consult your conversational academic AI coach with voice speech synthesis.',
      examples: ['"Open AI tutor"', '"Ask AI tutor"', '"Talk to tutor"'],
      parameters: 'None',
      action: 'Navigates to AI Voice Tutor interface',
    },
    {
      intent: 'REVIEW_DAILY_RECALL',
      category: 'AI Tutor & Recall',
      description: 'Start daily spaced-repetition flashcards derived from your books and notes.',
      examples: ['"Review daily recall"', '"Start recall"', '"Open flashcards"'],
      parameters: 'None',
      action: 'Navigates to Daily Recall flashcard engine',
    },
    {
      intent: 'SHOW_ANSWER',
      category: 'AI Tutor & Recall',
      description: 'Hands-free flashcard flip to check your answer during daily recall.',
      examples: ['"Show answer"', '"Flip card"', '"Flip the flashcard"'],
      parameters: 'None',
      action: 'Flips the active flashcard 3D face in Daily Recall',
    },

    // Core Productivity
    {
      intent: 'START_QUIZ',
      category: 'Core Productivity',
      description: 'Start an interactive multiple-choice assessment with custom subject and question count.',
      examples: ['"Start a quiz"', '"Start a Python quiz with 10 questions"', '"Start a 5 question Data Structures quiz"'],
      parameters: 'subject (Python | Data Structures | Web Development | Machine Learning), questionCount (number)',
      action: 'Configures and opens Quiz session immediately',
    },
    {
      intent: 'OPEN_STUDY_PLAN',
      category: 'Core Productivity',
      description: 'View today\'s study timetable and scheduled tasks.',
      examples: ['"Open my study plan"', '"Go to study plan"', '"Show my schedule"'],
      parameters: 'None',
      action: 'Navigates to Study Plan module',
    },
    {
      intent: 'CREATE_STUDY_PLAN',
      category: 'Core Productivity',
      description: 'Create a new study plan or schedule a subject task.',
      examples: ['"Create a study plan"', '"Add Python to my study plan"'],
      parameters: 'taskTitle (optional)',
      action: 'Opens task creation modal with pre-filled title',
    },
    {
      intent: 'OPEN_NOTES',
      category: 'Core Productivity',
      description: 'Browse, edit, and search lecture notes and revision guides.',
      examples: ['"Open my notes"', '"Go to notes"', '"Show my lecture notes"'],
      parameters: 'None',
      action: 'Navigates to Notes module',
    },
    {
      intent: 'SUMMARIZE_NOTES',
      category: 'Core Productivity',
      description: 'Run Gemini AI synthesis to generate executive summary, key takeaways, and flashcards.',
      examples: ['"Summarize my notes"', '"Summarize my Python notes"'],
      parameters: 'subject (optional)',
      action: 'Triggers AI Summarizer drawer on active or selected notes',
    },
    {
      intent: 'OPEN_ANALYTICS',
      category: 'Core Productivity',
      description: 'Review study hours, quiz accuracy rates, streak history, and weekly progress charts.',
      examples: ['"Open my analytics"', '"Show my progress"', '"Show how I\'m doing"'],
      parameters: 'None',
      action: 'Navigates to Analytics dashboard',
    },
    {
      intent: 'GO_HOME',
      category: 'Core Productivity',
      description: 'Navigate back to the main student dashboard view.',
      examples: ['"Go home"', '"Open dashboard"', '"Take me to the main page"'],
      parameters: 'None',
      action: 'Navigates to Dashboard module',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Supported Voice Commands</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Context-Aware Intent Resolution • Local Fast-Match + Gemini NLU Fallback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol Banner */}
        <div className="px-6 py-3 bg-emerald-50/70 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-800/40 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Context Aware Execution:</strong> Commands like "Explain this section" or "Next page" automatically adapt to your active reader and book.
            </span>
          </div>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-[11px]">
            {commandsList.length} Allowed Intents
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any sample prompt below to execute it immediately through the Voice Router:
          </p>

          <div className="grid grid-cols-1 gap-3">
            {commandsList.map((item) => (
              <div
                key={item.intent}
                className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-600/50 hover:shadow-xs transition-all flex flex-col gap-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/40">
                      {item.intent}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      [{item.category}]
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Param: {item.parameters}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">{item.description}</p>

                {/* Examples */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-medium text-slate-400">Try saying:</span>
                  {item.examples.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const clean = example.replace(/^"|"$/g, '');
                        onSelectPrompt(clean);
                        onClose();
                      }}
                      className="text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/40 px-2 py-0.5 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Mic className="w-2.5 h-2.5 text-indigo-500" />
                      <span>{example}</span>
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center space-x-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Natural speech is transcribed via Web Speech API and interpreted safely.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
