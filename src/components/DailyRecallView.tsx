import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Trophy,
  Mic,
  RefreshCw,
} from 'lucide-react';
import { FlashcardItem } from '../types';

interface DailyRecallViewProps {
  flashcards: FlashcardItem[];
  onToggleMastered: (cardId: string) => void;
  onVoicePromptClick: (text: string) => void;
  flipTrigger?: number; // voice trigger for SHOW_ANSWER
  nextTrigger?: number; // voice trigger for NEXT_FLASHCARD
  masteredTrigger?: number; // voice trigger for MARK_MASTERED
}

export function DailyRecallView({
  flashcards,
  onToggleMastered,
  onVoicePromptClick,
  flipTrigger,
  nextTrigger,
  masteredTrigger,
}: DailyRecallViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const activeCard = flashcards[currentIndex];

  // Voice action triggers
  useEffect(() => {
    if (flipTrigger && flipTrigger > 0) {
      setIsFlipped((prev) => !prev);
    }
  }, [flipTrigger]);

  useEffect(() => {
    if (nextTrigger && nextTrigger > 0) {
      handleNextCard();
    }
  }, [nextTrigger]);

  useEffect(() => {
    if (masteredTrigger && masteredTrigger > 0 && activeCard) {
      onToggleMastered(activeCard.id);
      handleNextCard();
    }
  }, [masteredTrigger]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setReviewedCount((prev) => prev + 1);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setReviewedCount(0);
  };

  const masteredCount = flashcards.filter((f) => f.mastered).length;
  const progressPercent = Math.round((masteredCount / flashcards.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Daily Recall Engine
              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Spaced Repetition
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active recall cards derived from your textbooks and lecture notes
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block">Mastered</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">
              {masteredCount}/{flashcards.length}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Retention</span>
            <span className="font-bold text-emerald-500 text-base">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Voice Context Helper */}
      <div className="bg-sky-950/40 border border-sky-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-sky-200">
          <Mic className="w-4 h-4 text-sky-400 animate-pulse" />
          <span>
            <strong>Recall Voice Commands:</strong> Say <span className="font-mono text-sky-300">"Show answer"</span>, <span className="font-mono text-sky-300">"Mark as mastered"</span>, or <span className="font-mono text-sky-300">"Next card"</span>.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="text-[11px] bg-sky-600/60 hover:bg-sky-600 text-white px-2.5 py-1 rounded-md transition-colors"
          >
            "Show answer"
          </button>
          <button
            onClick={handleNextCard}
            className="text-[11px] bg-sky-600/60 hover:bg-sky-600 text-white px-2.5 py-1 rounded-md transition-colors"
          >
            "Next card"
          </button>
        </div>
      </div>

      {/* Main Flashcard View */}
      {!sessionCompleted && activeCard ? (
        <div className="space-y-6">
          {/* Card Indicator Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>CARD {currentIndex + 1} OF {flashcards.length}</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              {activeCard.sourceRef}
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            id="interactive-flashcard"
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[340px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-3xl p-8 sm:p-12 shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-300 relative group"
          >
            {/* Top tag */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                {activeCard.category}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                {isFlipped ? 'Click or say "Flip" for question' : 'Click or say "Show answer" to flip'}
              </span>
            </div>

            {/* Content (Question or Answer) */}
            <div className="my-8 text-center">
              <span className="text-[11px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
                {isFlipped ? 'RECALL ANSWER' : 'PROMPT QUESTION'}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {isFlipped ? activeCard.answer : activeCard.question}
              </p>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span>Reps: {activeCard.repetitions}</span>
              <span className={activeCard.mastered ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                {activeCard.mastered ? '✓ Mastered' : '○ In Learning'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                if (activeCard.mastered) {
                  onToggleMastered(activeCard.id);
                }
                handleNextCard();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors shadow-sm"
            >
              <XCircle className="w-4 h-4" />
              Repeat Later
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <RotateCw className="w-4 h-4" />
              Flip Card
            </button>

            <button
              onClick={() => {
                if (!activeCard.mastered) {
                  onToggleMastered(activeCard.id);
                }
                handleNextCard();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Know It (Mastered)
            </button>
          </div>
        </div>
      ) : (
        /* Completion State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Daily Recall Session Complete!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              You reviewed {reviewedCount} flashcards. Spaced repetition retention updated.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Review Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
