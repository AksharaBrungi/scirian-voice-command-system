import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Brain,
  FileText,
  Highlighter,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Share2,
  ListOrdered,
  Volume2,
  RefreshCw,
  ArrowLeft,
  Mic,
} from 'lucide-react';
import { BookItem, ChapterItem } from '../types';

interface BookReaderViewProps {
  book: BookItem;
  onBackToLibrary: () => void;
  onLaunchQuizFromBook: (subject: string, questionCount: number) => void;
  onAddNoteFromReader: (title: string, content: string, subject: string) => void;
  onVoicePromptClick: (text: string) => void;
  explainTrigger?: number; // increments when voice triggers EXPLAIN_SECTION
  summarizeTrigger?: number; // increments when voice triggers SUMMARIZE_PAGE
}

export function BookReaderView({
  book,
  onBackToLibrary,
  onLaunchQuizFromBook,
  onAddNoteFromReader,
  onVoicePromptClick,
  explainTrigger,
  summarizeTrigger,
}: BookReaderViewProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [highlightActive, setHighlightActive] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);

  // Copilot AI Explanation / Summary states
  const [explanationData, setExplanationData] = useState<{
    concept: string;
    analogy: string;
    breakdown: string[];
  } | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const [summaryData, setSummaryData] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const activeChapter = book.chapters[currentChapterIndex] || book.chapters[0];

  // React to voice triggers
  useEffect(() => {
    if (explainTrigger && explainTrigger > 0) {
      handleExplainSection();
    }
  }, [explainTrigger]);

  useEffect(() => {
    if (summarizeTrigger && summarizeTrigger > 0) {
      handleSummarizePage();
    }
  }, [summarizeTrigger]);

  const handleNextPage = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  // Explain section using server endpoint
  const handleExplainSection = async () => {
    setIsExplaining(true);
    setSummaryData(null);
    try {
      const res = await fetch('/api/explain-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTitle: book.title,
          chapterTitle: activeChapter.title,
          textExcerpt: activeChapter.excerpt,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setExplanationData(data);
      }
    } catch (err) {
      setExplanationData({
        concept: 'High-availability replication models and consistency invariants.',
        analogy: 'Like keeping duplicated ledgers across distributed branch offices.',
        breakdown: [
          'Leader handles writes to avoid simultaneous split-brain conflicting state.',
          'Followers serve reads asynchronously to balance heavy read traffic.',
          'Eventual consistency requires conflict resolution mechanisms.',
        ],
      });
    } finally {
      setIsExplaining(false);
    }
  };

  // Summarize page
  const handleSummarizePage = async () => {
    setIsSummarizing(true);
    setExplanationData(null);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeChapter.title,
          content: activeChapter.fullText,
          subject: book.category,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data.summary || 'Summary synthesized from this chapter.');
      }
    } catch (e) {
      setSummaryData('Chapter synthesizes fundamental architecture: leader election, replication lag, and trade-offs between consistency and partition tolerance.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSaveToNotes = () => {
    if (explanationData) {
      onAddNoteFromReader(
        `${book.title} - ${activeChapter.title}`,
        `Concept: ${explanationData.concept}\nAnalogy: ${explanationData.analogy}\nBreakdown:\n${explanationData.breakdown.join('\n')}`,
        book.category
      );
    } else if (summaryData) {
      onAddNoteFromReader(
        `${book.title} Summary`,
        summaryData,
        book.category
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLibrary}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Library
          </button>

          <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{book.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium">
                {book.category}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
              {activeChapter.title}
            </p>
          </div>
        </div>

        {/* Reader Action Icons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font Size Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-300' : 'text-slate-500'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-1 rounded ${fontSize === 'base' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-300' : 'text-slate-500'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-300' : 'text-slate-500'}`}
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setHighlightActive(!highlightActive)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1 border transition-colors ${
              highlightActive
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Highlight</span>
          </button>

          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isCopilotOpen
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Copilot
          </button>
        </div>
      </div>

      {/* Voice Context Banner */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-indigo-200">
          <Mic className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>
            <strong>Reader Voice Context:</strong> Say <span className="font-mono text-indigo-300">"Explain this section"</span>, <span className="font-mono text-indigo-300">"Summarize this page"</span>, or <span className="font-mono text-indigo-300">"Next page"</span>.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExplainSection}
            className="text-[11px] bg-indigo-600/60 hover:bg-indigo-600 text-white px-2.5 py-1 rounded-md transition-colors"
          >
            "Explain this section"
          </button>
          <button
            onClick={handleSummarizePage}
            className="text-[11px] bg-indigo-600/60 hover:bg-indigo-600 text-white px-2.5 py-1 rounded-md transition-colors"
          >
            "Summarize this page"
          </button>
        </div>
      </div>

      {/* Two-Column Workspace: Document Reader on Left, AI Copilot on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Document Reader Main Canvas */}
        <div className={`${isCopilotOpen ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-300 space-y-4`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 min-h-[560px] flex flex-col justify-between">
            {/* Document Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono">CHAPTER {currentChapterIndex + 1} OF {book.chapters.length}</span>
                <span>Page {activeChapter.pageStart}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-4 tracking-tight">
                {activeChapter.title}
              </h2>

              {/* Key Concept Chips */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {activeChapter.keyConcepts.map((k) => (
                  <span
                    key={k}
                    className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-medium"
                  >
                    #{k}
                  </span>
                ))}
              </div>

              {/* Text Body */}
              <div
                className={`mt-6 text-slate-700 dark:text-slate-200 leading-relaxed font-sans space-y-4 ${
                  fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg leading-loose' : 'text-base'
                } ${highlightActive ? 'bg-amber-500/5 p-4 rounded-xl border border-amber-500/20' : ''}`}
              >
                {activeChapter.fullText.split('\n\n').map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                id="btn-prev-page"
                onClick={handlePrevPage}
                disabled={currentChapterIndex === 0}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Chapter
              </button>

              <span className="text-xs text-slate-400 font-mono">
                {currentChapterIndex + 1} / {book.chapters.length}
              </span>

              <button
                id="btn-next-page"
                onClick={handleNextPage}
                disabled={currentChapterIndex === book.chapters.length - 1}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Next Chapter
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Study Copilot Sidebar */}
        {isCopilotOpen && (
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Study Copilot</h3>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  Active
                </span>
              </div>

              {/* Quick AI Action Triggers */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-explain-section"
                  onClick={handleExplainSection}
                  disabled={isExplaining}
                  className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/40 text-left transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <Brain className="w-3.5 h-3.5" />
                    Explain Section
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Concept breakdown & analogy
                  </p>
                </button>

                <button
                  id="btn-summarize-page"
                  onClick={handleSummarizePage}
                  disabled={isSummarizing}
                  className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/40 text-left transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                    <FileText className="w-3.5 h-3.5" />
                    Summarize Page
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Key executive takeaways
                  </p>
                </button>
              </div>

              <button
                onClick={() => onLaunchQuizFromBook(book.category, 5)}
                className="w-full p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/40 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Generate Chapter Quiz
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    5 questions testing {activeChapter.keyConcepts[0] || 'core concepts'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500" />
              </button>

              {/* Loading State */}
              {(isExplaining || isSummarizing) && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span>Synthesizing with Scirian AI engine...</span>
                </div>
              )}

              {/* Render Explanation Output */}
              {explanationData && !isExplaining && (
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 dark:text-indigo-200 uppercase text-[10px] tracking-wider">
                      Concept Deep Dive
                    </span>
                    <button
                      onClick={handleSaveToNotes}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                    >
                      + Save to Notes
                    </button>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Core Principle:</h4>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{explanationData.concept}</p>
                  </div>

                  {explanationData.analogy && (
                    <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/60">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
                        Intuitive Analogy:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 italic mt-0.5">
                        "{explanationData.analogy}"
                      </p>
                    </div>
                  )}

                  {explanationData.breakdown && (
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
                        Technical Invariants:
                      </span>
                      {explanationData.breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Render Summary Output */}
              {summaryData && !isSummarizing && (
                <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 dark:text-purple-200 uppercase text-[10px] tracking-wider">
                      Executive Summary
                    </span>
                    <button
                      onClick={handleSaveToNotes}
                      className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                    >
                      + Save to Notes
                    </button>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{summaryData}</p>
                </div>
              )}

              {/* Book Chapters Table of Contents */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Table of Contents
                </span>
                <div className="space-y-1">
                  {book.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => setCurrentChapterIndex(idx)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        idx === currentChapterIndex
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate max-w-[200px]">{ch.title}</span>
                      <span className="text-[10px] opacity-70">p. {ch.pageStart}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
