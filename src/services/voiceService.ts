import { AllowedIntent, CommandParameters, VoiceCommandResult, VoiceCommandContext } from '../types';

// Declare Web Speech API types for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface WebSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: WebSpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: WebSpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: WebSpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: WebSpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): WebSpeechRecognition };
    webkitSpeechRecognition?: { new (): WebSpeechRecognition };
  }
}

export const ALLOWED_INTENTS: readonly AllowedIntent[] = [
  'GO_HOME',
  'OPEN_LIBRARY',
  'OPEN_READER',
  'OPEN_STUDY_PLAN',
  'CREATE_STUDY_PLAN',
  'SHOW_STUDY_PLAN',
  'START_QUIZ',
  'OPEN_NOTES',
  'SUMMARIZE_NOTES',
  'OPEN_ANALYTICS',
  'OPEN_AI_TUTOR',
  'OPEN_DAILY_RECALL',
  'SHOW_HELP',
  'EXPLAIN_SECTION',
  'SUMMARIZE_PAGE',
  'GENERATE_BOOK_QUIZ',
  'NEXT_PAGE',
  'PREVIOUS_PAGE',
  'NEXT_QUESTION',
  'EXPLAIN_ANSWER',
  'SELECT_OPTION',
  'CREATE_FLASHCARDS',
  'ADD_NOTE',
  'SHOW_ANSWER',
  'NEXT_FLASHCARD',
  'MARK_MASTERED',
  'ASK_TUTOR',
] as const;

/**
 * Fast client-side rule-based Intent Matcher with Context-Awareness
 * Provides instant zero-latency responses for primary commands
 */
export function matchLocalIntent(
  rawTranscript: string,
  context?: VoiceCommandContext
): {
  intent: AllowedIntent;
  confidence: number;
  parameters: CommandParameters;
  matched: boolean;
} {
  const text = rawTranscript.toLowerCase().trim();
  const activeTab = context?.activeTab || 'dashboard';

  // 1. HELP
  if (
    text.includes('help') ||
    text.includes('what can you do') ||
    text.includes('command list') ||
    text.includes('voice guide') ||
    text.includes('show commands')
  ) {
    return { intent: 'SHOW_HELP', confidence: 0.99, parameters: {}, matched: true };
  }

  // 2. CONTEXTUAL: READER ACTIONS
  if (activeTab === 'reader' || text.includes('this section') || text.includes('this page') || text.includes('this chapter')) {
    if (text.includes('explain') && (text.includes('section') || text.includes('paragraph') || text.includes('concept') || text.includes('this'))) {
      return {
        intent: 'EXPLAIN_SECTION',
        confidence: 0.98,
        parameters: { bookId: context?.currentBookId, page: context?.currentPage },
        matched: true,
      };
    }
    if (text.includes('summariz') && (text.includes('page') || text.includes('chapter') || text.includes('section') || text.includes('this'))) {
      return {
        intent: 'SUMMARIZE_PAGE',
        confidence: 0.98,
        parameters: { bookId: context?.currentBookId, page: context?.currentPage },
        matched: true,
      };
    }
    if (text.includes('quiz') && (text.includes('from this') || text.includes('chapter') || text.includes('book'))) {
      return {
        intent: 'GENERATE_BOOK_QUIZ',
        confidence: 0.97,
        parameters: {
          bookId: context?.currentBookId,
          subject: context?.currentBookTitle || 'System Architecture',
        },
        matched: true,
      };
    }
    if (text.includes('next page') || text === 'next') {
      return { intent: 'NEXT_PAGE', confidence: 0.98, parameters: {}, matched: true };
    }
    if (text.includes('previous page') || text.includes('prev page') || text.includes('back page')) {
      return { intent: 'PREVIOUS_PAGE', confidence: 0.98, parameters: {}, matched: true };
    }
  }

  // 3. CONTEXTUAL: QUIZ ACTIONS
  if (activeTab === 'quiz' || context?.quizActive) {
    if (text.includes('next question') || text === 'next') {
      return { intent: 'NEXT_QUESTION', confidence: 0.98, parameters: {}, matched: true };
    }
    if (text.includes('explain') || text.includes('why') || text.includes('solution')) {
      return { intent: 'EXPLAIN_ANSWER', confidence: 0.97, parameters: {}, matched: true };
    }
    const optMatch = text.match(/(?:option|choose|select|pick)\s+([a-d]|1|2|3|4)/i);
    if (optMatch) {
      const val = optMatch[1].toLowerCase();
      const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      return {
        intent: 'SELECT_OPTION',
        confidence: 0.96,
        parameters: { optionIndex: map[val] ?? 0 },
        matched: true,
      };
    }
  }

  // 4. CONTEXTUAL: DAILY RECALL ACTIONS
  if (activeTab === 'daily-recall' || context?.recallActive) {
    if (text.includes('show answer') || text.includes('flip') || text.includes('reveal')) {
      return { intent: 'SHOW_ANSWER', confidence: 0.98, parameters: {}, matched: true };
    }
    if (text.includes('mastered') || text.includes('know it') || text.includes('got it')) {
      return { intent: 'MARK_MASTERED', confidence: 0.98, parameters: {}, matched: true };
    }
    if (text.includes('next card') || text.includes('next flashcard') || text === 'next') {
      return { intent: 'NEXT_FLASHCARD', confidence: 0.98, parameters: {}, matched: true };
    }
  }

  // 5. GLOBAL: MY LIBRARY & BOOK READER
  if (
    text.includes('open library') ||
    text.includes('my library') ||
    text.includes('go to library') ||
    text.includes('show library') ||
    text.includes('show books') ||
    text.includes('my books')
  ) {
    return { intent: 'OPEN_LIBRARY', confidence: 0.99, parameters: {}, matched: true };
  }

  if (
    text.includes('open reader') ||
    text.includes('read book') ||
    text.includes('continue reading') ||
    text.includes('continue learning')
  ) {
    return { intent: 'OPEN_READER', confidence: 0.98, parameters: {}, matched: true };
  }

  // 6. GLOBAL: AI TUTOR
  if (
    text.includes('ai tutor') ||
    text.includes('open tutor') ||
    text.includes('talk to tutor') ||
    text.includes('ask tutor') ||
    text.includes('chat with tutor') ||
    text.startsWith('ask ai') ||
    text.startsWith('ask tutor')
  ) {
    let query = '';
    const askMatch = text.match(/(?:ask\s+(?:ai|tutor)|tutor)\s+(.+)/);
    if (askMatch && askMatch[1]) {
      query = askMatch[1].trim();
    }
    return {
      intent: 'OPEN_AI_TUTOR',
      confidence: 0.98,
      parameters: query ? { query } : {},
      matched: true,
    };
  }

  // 7. GLOBAL: DAILY RECALL
  if (
    text.includes('daily recall') ||
    text.includes('flashcard') ||
    text.includes('review recall') ||
    text.includes('practice flashcards') ||
    text.includes('spaced repetition')
  ) {
    return { intent: 'OPEN_DAILY_RECALL', confidence: 0.98, parameters: {}, matched: true };
  }

  // 8. GLOBAL: DASHBOARD / HOME
  if (
    text === 'home' ||
    text === 'go home' ||
    text === 'dashboard' ||
    text.includes('go to dashboard') ||
    text.includes('open dashboard') ||
    text.includes('take me home') ||
    text.includes('back to dashboard')
  ) {
    return { intent: 'GO_HOME', confidence: 0.99, parameters: {}, matched: true };
  }

  // 9. GLOBAL: QUIZ
  if (text.includes('quiz') || text.includes('test') || text.includes('exam')) {
    let subject = 'Python';
    if (text.includes('architecture') || text.includes('system')) subject = 'System Architecture';
    else if (text.includes('python')) subject = 'Python';
    else if (text.includes('data structure') || text.includes('dsa') || text.includes('algorithm')) subject = 'Data Structures';
    else if (text.includes('machine learning') || text.includes('ai') || text.includes('ml')) subject = 'Machine Learning';

    const countMatch = text.match(/(\d+)\s*(?:question|item|problem)/);
    const questionCount = countMatch ? parseInt(countMatch[1], 10) : 10;

    return {
      intent: 'START_QUIZ',
      confidence: 0.98,
      parameters: { subject, questionCount },
      matched: true,
    };
  }

  // 10. GLOBAL: NOTES & SUMMARIZATION
  if (
    text.includes('summariz') ||
    text.includes('summary of notes') ||
    text.includes('summarize my notes') ||
    text.includes('make a summary')
  ) {
    let subject = '';
    if (text.includes('python')) subject = 'Python';
    else if (text.includes('data structure') || text.includes('algorithm')) subject = 'Data Structures';
    else if (text.includes('architecture') || text.includes('replication')) subject = 'System Architecture';

    return {
      intent: 'SUMMARIZE_NOTES',
      confidence: 0.97,
      parameters: subject ? { subject } : {},
      matched: true,
    };
  }

  if (text.includes('create flashcard') || text.includes('make flashcards')) {
    return { intent: 'CREATE_FLASHCARDS', confidence: 0.97, parameters: {}, matched: true };
  }

  if (
    text.includes('open my notes') ||
    text.includes('open notes') ||
    text.includes('show my notes') ||
    text.includes('go to notes') ||
    text.includes('view notes')
  ) {
    return { intent: 'OPEN_NOTES', confidence: 0.97, parameters: {}, matched: true };
  }

  // 11. GLOBAL: ANALYTICS / PROGRESS
  if (
    text.includes('analytics') ||
    text.includes('progress') ||
    text.includes('statistic') ||
    text.includes('performance') ||
    text.includes('how i am doing') ||
    text.includes("how i'm doing") ||
    text.includes('show my stats') ||
    text.includes('my study hours')
  ) {
    return { intent: 'OPEN_ANALYTICS', confidence: 0.98, parameters: {}, matched: true };
  }

  // 12. GLOBAL: CREATE / ADD STUDY PLAN TASK
  if (
    text.includes('create a study plan') ||
    text.includes('create study plan') ||
    text.includes('make a study plan') ||
    text.includes('new study plan') ||
    (text.includes('add') && (text.includes('study plan') || text.includes('task') || text.includes('schedule')))
  ) {
    let taskTitle = '';
    const match = text.match(/(?:for|about|on)\s+([a-zA-Z0-9\s]+?)(?:\s+to|\s+in|$)/);
    if (match && match[1]) taskTitle = match[1].trim();

    return {
      intent: 'CREATE_STUDY_PLAN',
      confidence: 0.95,
      parameters: taskTitle ? { taskTitle } : {},
      matched: true,
    };
  }

  if (text.includes('study plan') || text.includes('schedule') || text.includes('tasks') || text.includes('routine')) {
    return { intent: 'OPEN_STUDY_PLAN', confidence: 0.96, parameters: {}, matched: true };
  }

  return { intent: 'UNKNOWN', confidence: 0.0, parameters: {}, matched: false };
}

/**
 * High-level Hybrid Intent Resolver:
 * 1. Checks fast client-side rules with context.
 * 2. If no confident match, calls server Gemini NLU endpoint with context.
 */
export async function resolveIntent(
  rawTranscript: string,
  context?: VoiceCommandContext
): Promise<{
  intent: AllowedIntent;
  confidence: number;
  parameters: CommandParameters;
  source: 'rule_engine' | 'gemini_nlu' | 'fallback';
}> {
  // Step 1: Local fast rule resolution
  const local = matchLocalIntent(rawTranscript, context);
  if (local.matched && local.confidence >= 0.95) {
    return {
      intent: local.intent,
      confidence: local.confidence,
      parameters: local.parameters,
      source: 'rule_engine',
    };
  }

  // Step 2: Server-side Gemini NLU with context
  try {
    const response = await fetch('/api/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: rawTranscript, context }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.intent && ALLOWED_INTENTS.includes(data.intent)) {
        return {
          intent: data.intent,
          confidence: data.confidence || 0.85,
          parameters: data.parameters || {},
          source: data.source || 'gemini_nlu',
        };
      }
    }
  } catch (error) {
    console.warn('Server intent resolution failed, relying on local fallback:', error);
  }

  // Step 3: Return local best guess or fallback
  if (local.matched) {
    return {
      intent: local.intent,
      confidence: local.confidence,
      parameters: local.parameters,
      source: 'rule_engine',
    };
  }

  return {
    intent: 'UNKNOWN',
    confidence: 0.2,
    parameters: {},
    source: 'fallback',
  };
}

/**
 * Web Speech API Controller for Speech-to-Text
 */
class SpeechRecognitionController {
  private recognition: WebSpeechRecognition | null = null;
  private isListening: boolean = false;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;

  constructor() {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public startListening(callbacks: {
    onInterim: (text: string) => void;
    onFinal: (text: string) => void;
    onError: (errorMsg: string) => void;
    onAudioLevel?: (level: number) => void;
  }): boolean {
    if (!this.recognition) {
      callbacks.onError('Web Speech API is not supported in this browser. You can type commands in the test input.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.isListening = true;

    // Start audio meter for visual waveform feedback
    this.startAudioMeter(callbacks.onAudioLevel);

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimStr = '';
      let finalStr = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalStr += item[0].transcript;
        } else {
          interimStr += item[0].transcript;
        }
      }

      if (interimStr) {
        callbacks.onInterim(interimStr);
      }

      if (finalStr) {
        this.stopAudioMeter();
        this.isListening = false;
        callbacks.onFinal(finalStr);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.stopAudioMeter();
      this.isListening = false;
      let msg = `Speech error: ${event.error}`;
      if (event.error === 'not-allowed') {
        msg = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech was detected. Please try speaking again.';
      }
      callbacks.onError(msg);
    };

    this.recognition.onend = () => {
      this.stopAudioMeter();
      this.isListening = false;
    };

    try {
      this.recognition.start();
      return true;
    } catch (err: any) {
      this.stopAudioMeter();
      this.isListening = false;
      callbacks.onError(`Could not start microphone: ${err?.message || err}`);
      return false;
    }
  }

  public stopListening() {
    this.isListening = false;
    this.stopAudioMeter();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // silent
      }
    }
  }

  private async startAudioMeter(onLevel?: (level: number) => void) {
    if (!onLevel || !navigator.mediaDevices?.getUserMedia) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!this.analyser || !this.isListening) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(1, Math.max(0, average / 128));
        onLevel(normalized);
        this.animFrameId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      // Audio metering is purely decorative, fall back gracefully
    }
  }

  private stopAudioMeter() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }
}

export const speechService = new SpeechRecognitionController();
