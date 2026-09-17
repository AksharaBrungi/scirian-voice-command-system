import React from 'react';
import {
  BookOpen,
  BookMarked,
  Bot,
  Brain,
  CalendarCheck,
  GraduationCap,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  Circle,
  Flame,
  ArrowRight,
  Sparkles,
  TrendingUp,
  History,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  AllowedIntent,
  BookItem,
  CommandParameters,
  FlashcardItem,
  PageTab,
  StudentProfile,
  StudyTask,
  VoiceCommandResult,
  VoiceState,
} from '../types';
import { VoiceAssistantCenterpiece } from './VoiceAssistantCenterpiece';

interface DashboardViewProps {
  profile: StudentProfile;
  tasks: StudyTask[];
  books: BookItem[];
  flashcards: FlashcardItem[];
  commandHistory: VoiceCommandResult[];
  voiceState: VoiceState;
  transcript: string;
  interimTranscript: string;
  lastIntent?: AllowedIntent;
  lastParameters?: CommandParameters;
  lastConfidence?: number;
  lastActionSummary?: string;
  errorMessage?: string;
  audioLevel: number;
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmitCommand: (text: string) => void;
  onNavigateTab: (tab: PageTab) => void;
  onSelectBook: (bookId: string) => void;
  onToggleTask: (taskId: string) => void;
  onOpenHelp: () => void;
  onResetVoice: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  tasks,
  books,
  flashcards,
  commandHistory,
  voiceState,
  transcript,
  interimTranscript,
  lastIntent,
  lastParameters,
  lastConfidence,
  lastActionSummary,
  errorMessage,
  audioLevel,
  onStartListening,
  onStopListening,
  onSubmitCommand,
  onNavigateTab,
  onSelectBook,
  onToggleTask,
  onOpenHelp,
  onResetVoice,
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Active book being read
  const currentReadingBook = books[0];

  // Recall stats
  const masteredCards = flashcards.filter((f) => f.mastered).length;
  const retentionPercent = Math.round((masteredCards / flashcards.length) * 100);

  const quickActionCards = [
    {
      id: 'library' as PageTab,
      title: 'My Library',
      description: 'Textbooks, PDFs & research material indexed for AI reading',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      tag: `${books.length} Books`,
      voiceHint: '"Open my library"',
    },
    {
      id: 'reader' as PageTab,
      title: 'Book Reader',
      description: 'Read with AI Copilot section breakdown & voice pagination',
      icon: BookMarked,
      color: 'from-cyan-600 to-blue-700',
      tag: 'Interactive',
      voiceHint: '"Continue reading"',
    },
    {
      id: 'ai-tutor' as PageTab,
      title: 'AI Voice Tutor',
      description: 'Voice chat tutor with spoken synthesis and Socratic coaching',
      icon: Bot,
      color: 'from-purple-600 to-indigo-600',
      tag: 'Spoken Audio',
      voiceHint: '"Open AI tutor"',
    },
    {
      id: 'daily-recall' as PageTab,
      title: 'Daily Recall',
      description: 'Spaced repetition flashcards with hands-free flip controls',
      icon: Brain,
      color: 'from-sky-600 to-emerald-600',
      tag: `${flashcards.length} Cards`,
      voiceHint: '"Review daily recall"',
    },
    {
      id: 'quiz' as PageTab,
      title: 'Practice Quiz',
      description: 'Adaptive quizzes in Python, DSA, and ML architecture',
      icon: GraduationCap,
      color: 'from-violet-600 to-purple-600',
      tag: 'AI Generator',
      voiceHint: '"Start a Python quiz"',
    },
    {
      id: 'notes' as PageTab,
      title: 'Study Notes',
      description: 'Lecture notes with automated Gemini summarization',
      icon: FileText,
      color: 'from-amber-600 to-orange-600',
      tag: 'AI Summary',
      voiceHint: '"Summarize my notes"',
    },
    {
      id: 'study-plan' as PageTab,
      title: 'Study Plan',
      description: 'Organize today’s timetable and study sessions',
      icon: CalendarCheck,
      color: 'from-blue-600 to-indigo-600',
      tag: '5 Tasks Scheduled',
      voiceHint: '"Create a study plan"',
    },
    {
      id: 'analytics' as PageTab,
      title: 'Analytics',
      description: 'Weekly study velocity, accuracy curves & streak history',
      icon: BarChart3,
      color: 'from-emerald-600 to-teal-600',
      tag: '87% Accuracy',
      voiceHint: '"Open my analytics"',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {profile.name}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Scirian Learning Workspace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Control your learning experience manually or hands-free using natural voice commands.
          </p>
        </div>

        {/* Top metrics badges */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Study Streak</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">{profile.streakDays} Days</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Task Completion</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">{completionPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Voice Assistant Centerpiece (Central Highlight) */}
      <section aria-label="Voice Assistant Centerpiece">
        <VoiceAssistantCenterpiece
          voiceState={voiceState}
          transcript={transcript}
          interimTranscript={interimTranscript}
          lastIntent={lastIntent}
          lastParameters={lastParameters}
          lastConfidence={lastConfidence}
          lastActionSummary={lastActionSummary}
          errorMessage={errorMessage}
          audioLevel={audioLevel}
          onStartListening={onStartListening}
          onStopListening={onStopListening}
          onSubmitCommand={onSubmitCommand}
          onOpenHelp={onOpenHelp}
          onReset={onResetVoice}
        />
      </section>

      {/* Scirian Learning Pillars: Active Book & Daily Recall Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Continue Learning / Active Book Card */}
        {currentReadingBook && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <BookMarked className="w-3.5 h-3.5" />
                  Currently Reading
                </span>
                <span className="font-mono">Page {currentReadingBook.currentPage} of {currentReadingBook.totalPages}</span>
              </div>

              <div className="flex items-start gap-4">
                <div className={`w-14 h-18 rounded-lg bg-gradient-to-br ${currentReadingBook.coverGradient} p-2 flex flex-col justify-end text-white flex-shrink-0 shadow-md`}>
                  <BookOpen className="w-4 h-4 mb-1" />
                  <span className="text-[8px] font-bold truncate">{currentReadingBook.category}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {currentReadingBook.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentReadingBook.author}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {currentReadingBook.chapters[0]?.title || 'Next chapter ready for active review'}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Reading Progress</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{currentReadingBook.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${currentReadingBook.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Voice: "Continue reading"</span>
              <button
                id="btn-dashboard-continue-reading"
                onClick={() => {
                  onSelectBook(currentReadingBook.id);
                  onNavigateTab('reader');
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Continue Reading</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Daily Recall Readiness Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Brain className="w-3.5 h-3.5" />
                Spaced Repetition
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{retentionPercent}% Retention</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Recall Ready
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You have {flashcards.length - masteredCards} flashcards ready for today's review session to maintain long-term retention.
              </p>
            </div>

            {/* Quick preview card pill */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Up Next: "{flashcards[0]?.question}"
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Source: {flashcards[0]?.sourceRef}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Voice: "Review daily recall"</span>
            <button
              id="btn-dashboard-start-recall"
              onClick={() => onNavigateTab('daily-recall')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Start Daily Recall</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Learning Modules</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Every module can be controlled manually or hands-free via voice</p>
          </div>
          <span className="text-xs font-medium text-slate-400">{quickActionCards.length} Modules Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                id={`quick-action-${card.id}`}
                onClick={() => onNavigateTab(card.id)}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{card.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <span className="text-[11px] font-normal italic text-slate-400 group-hover:text-indigo-500 truncate max-w-[170px]">
                    Try {card.voiceHint}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Two Column Layout: Today's Tasks & Recent Voice Commands */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Schedule & Tasks Preview */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Study Schedule</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {completedCount} of {totalTasks} tasks completed
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('study-plan')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center space-x-1"
              >
                <span>View Full Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Task Checklist */}
            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 hover:border-indigo-200 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button className="text-indigo-600 dark:text-indigo-400">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                        <span>{task.subject}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedMinutes}m</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Voice command: &ldquo;Create a study plan&rdquo;</span>
            <button
              onClick={() => onNavigateTab('study-plan')}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              + Add Tasks
            </button>
          </div>
        </div>

        {/* Right Column: Live Voice Pipeline History */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Voice Actions</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Audited pipeline execution trace</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {commandHistory.length} Total
              </span>
            </div>

            {commandHistory.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Zap className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No voice commands recorded yet.</p>
                <p className="text-[11px] text-slate-400">
                  Try speaking &ldquo;Start a Python quiz&rdquo; or &ldquo;Continue reading&rdquo;
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {commandHistory.slice(0, 4).map((hist) => (
                  <div
                    key={hist.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        &ldquo;{hist.transcript}&rdquo;
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          hist.success
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {hist.intent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="truncate max-w-[220px]">{hist.actionSummary}</span>
                      <span className="font-mono text-[10px]">{Math.round(hist.confidence * 100)}% conf</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px]">Speech-to-Intent Latency: &lt;180ms</span>
            <button
              onClick={onOpenHelp}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              View All Commands
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
