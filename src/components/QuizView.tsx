import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Code2,
  Clock,
  Mic,
  Award,
  ChevronRight,
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { QUIZ_BANK } from '../data/mockData';

interface QuizViewProps {
  initialSubject?: string;
  initialQuestionCount?: number;
  onRecordResult?: (subject: string, score: number, total: number) => void;
  onVoiceTriggerPrompt?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialSubject = 'Python',
  initialQuestionCount = 10,
  onRecordResult,
  onVoiceTriggerPrompt,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [questionCount, setQuestionCount] = useState(initialQuestionCount);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selected: number; isCorrect: boolean }[]
  >([]);

  // Update selection if prop changes from voice command
  useEffect(() => {
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
    if (initialQuestionCount) {
      setQuestionCount(initialQuestionCount);
    }
  }, [initialSubject, initialQuestionCount]);

  // Filter available questions by subject
  const availableQuestions = QUIZ_BANK.filter(
    (q) => q.subject.toLowerCase() === selectedSubject.toLowerCase()
  );

  const activeQuizQuestions = availableQuestions.slice(0, questionCount);

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setIsCompleted(false);
    setIsQuizActive(true);
  };

  const currentQuestion: QuizQuestion | undefined = activeQuizQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedOption,
        isCorrect,
      },
    ]);
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
      setIsQuizActive(false);
      const finalScore = score + (selectedOption === currentQuestion?.correctIndex ? 1 : 0);
      onRecordResult?.(selectedSubject, finalScore, activeQuizQuestions.length);
    }
  };

  const progressPercent =
    activeQuizQuestions.length > 0
      ? Math.round(((currentIndex + (isSubmitted ? 1 : 0)) / activeQuizQuestions.length) * 100)
      : 0;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Interactive Assessment Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Practice & Diagnostic Quiz
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Test and reinforce your knowledge. Voice-enabled with parameters like &ldquo;Start a 10 question Python quiz&rdquo;.
          </p>
        </div>

        <button
          onClick={onVoiceTriggerPrompt}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Mic className="w-3.5 h-3.5 text-indigo-600" />
          <span>&ldquo;Start a Python quiz&rdquo;</span>
        </button>
      </div>

      {/* QUIZ SETUP / SELECTION SCREEN */}
      {!isQuizActive && !isCompleted && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Configure Your Assessment</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose your focus domain and desired question depth.
            </p>
          </div>

          {/* Subject selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Subject
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Python', desc: 'Syntax, Closures, OOP & GIL' },
                { name: 'Data Structures', desc: 'Trees, Graphs, Sorting & Heaps' },
                { name: 'Web Development', desc: 'React, Performance & Protocols' },
                { name: 'Machine Learning', desc: 'Neural Networks & Optimization' },
              ].map((subj) => (
                <button
                  key={subj.name}
                  onClick={() => setSelectedSubject(subj.name)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedSubject.toLowerCase() === subj.name.toLowerCase()
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900">{subj.name}</span>
                    {selectedSubject.toLowerCase() === subj.name.toLowerCase() && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{subj.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question count selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Number of Questions
            </label>
            <div className="flex flex-wrap gap-3">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    questionCount === cnt
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Launch Quiz Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Selected: <strong className="text-slate-900">{selectedSubject}</strong> •{' '}
              <strong className="text-slate-900">{questionCount} Questions</strong>
            </div>

            <button
              id="start-quiz-btn"
              onClick={handleStartQuiz}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ SESSION */}
      {isQuizActive && currentQuestion && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-2xs space-y-6 animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentQuestion.subject}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Question {currentIndex + 1} of {activeQuizQuestions.length}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Score</span>
                <span className="text-sm font-extrabold text-indigo-600">{score} pts</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Code Snippet Box if available */}
            {currentQuestion.codeSnippet && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <pre>{currentQuestion.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuestion.correctIndex;

              let optionStyle =
                'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 text-slate-800';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                } else {
                  optionStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-900 font-medium';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs md:text-sm">{option}</span>
                  </div>

                  {isSubmitted && (
                    <div>
                      {isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when submitted */}
          {isSubmitted && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-slate-700 block mb-1">Explanation:</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setIsQuizActive(false);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Exit Assessment
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <span>
                  {currentIndex + 1 < activeQuizQuestions.length
                    ? 'Next Question'
                    : 'View Final Results'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ COMPLETION SCREEN */}
      {isCompleted && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-2xs text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Assessment Completed
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {selectedSubject} Knowledge Check
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Here is your verified performance summary.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Final Score
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {score} / {activeQuizQuestions.length}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">
                {Math.round((score / Math.max(1, activeQuizQuestions.length)) * 100)}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={handleStartQuiz}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={() => {
                setIsCompleted(false);
                setIsQuizActive(false);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Configure Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
