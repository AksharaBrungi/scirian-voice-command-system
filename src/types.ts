export type AllowedIntent =
  // Global Navigation & Core Actions
  | 'GO_HOME'
  | 'OPEN_LIBRARY'
  | 'OPEN_READER'
  | 'CONTINUE_READING'
  | 'OPEN_STUDY_PLAN'
  | 'CREATE_STUDY_PLAN'
  | 'SHOW_STUDY_PLAN'
  | 'START_QUIZ'
  | 'OPEN_NOTES'
  | 'SUMMARIZE_NOTES'
  | 'OPEN_ANALYTICS'
  | 'OPEN_AI_TUTOR'
  | 'OPEN_DAILY_RECALL'
  | 'REVIEW_DAILY_RECALL'
  | 'SHOW_HELP'
  // Contextual Actions: Book Reader
  | 'EXPLAIN_SECTION'
  | 'SUMMARIZE_PAGE'
  | 'GENERATE_BOOK_QUIZ'
  | 'NEXT_PAGE'
  | 'PREVIOUS_PAGE'
  // Contextual Actions: Quiz
  | 'NEXT_QUESTION'
  | 'EXPLAIN_ANSWER'
  | 'SELECT_OPTION'
  // Contextual Actions: Notes
  | 'CREATE_FLASHCARDS'
  | 'ADD_NOTE'
  // Contextual Actions: Daily Recall
  | 'SHOW_ANSWER'
  | 'NEXT_FLASHCARD'
  | 'MARK_MASTERED'
  // Contextual Actions: AI Tutor
  | 'ASK_TUTOR'
  // Fallback
  | 'UNKNOWN';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'result' | 'error';

export type PageTab =
  | 'dashboard'
  | 'library'
  | 'reader'
  | 'ai-tutor'
  | 'daily-recall'
  | 'study-plan'
  | 'quiz'
  | 'notes'
  | 'analytics';

export interface CommandParameters {
  subject?: string;
  questionCount?: number;
  taskTitle?: string;
  bookId?: string;
  chapterTitle?: string;
  optionIndex?: number;
  query?: string;
  noteTitle?: string;
  [key: string]: any;
}

export interface VoiceCommandContext {
  activeTab: PageTab;
  currentBookId?: string;
  currentBookTitle?: string;
  currentPage?: number;
  currentChapterTitle?: string;
  currentNoteId?: string;
  quizActive?: boolean;
  quizSubject?: string;
  currentQuestionIndex?: number;
  recallActive?: boolean;
  recallCardIndex?: number;
}

export interface VoiceCommandResult {
  id: string;
  transcript: string;
  intent: AllowedIntent;
  confidence: number;
  parameters: CommandParameters;
  actionSummary: string;
  timestamp: string;
  source: 'rule_engine' | 'gemini_nlu' | 'manual_test' | 'fallback';
  status: 'executed' | 'rejected' | 'clarification_needed';
  contextSnapshot?: Partial<VoiceCommandContext>;
}

export interface ChapterItem {
  id: string;
  title: string;
  pageStart: number;
  excerpt: string;
  fullText: string;
  keyConcepts: string[];
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  coverGradient: string;
  category: string;
  totalPages: number;
  currentPage: number;
  progressPercent: number;
  lastReadAt: string;
  summary: string;
  chapters: ChapterItem[];
  fileSize?: string;
}

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sourceRef: string;
  mastered: boolean;
  repetitions: number;
  lastReviewed?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextTag?: string;
  audioSynthesized?: boolean;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  time: string;
  durationMinutes: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  bookRef?: string;
  dueDate?: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  content: string;
  updatedAt: string;
  tags: string[];
  bookRef?: string;
}

export interface NoteSummaryResponse {
  summary: string;
  keyPoints: string[];
  flashcards: {
    front: string;
    back: string;
  }[];
  source?: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  major: string;
  semester: string;
  avatarUrl: string;
  streakDays: number;
  targetDailyHours: number;
  booksCompleted: number;
  quizzesTaken: number;
  totalStudyHours: number;
}
