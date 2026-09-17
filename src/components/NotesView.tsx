import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Sparkles,
  Bookmark,
  Share2,
  Trash2,
  Tag,
  Mic,
  RefreshCw,
  X,
  CheckCircle2,
  Copy,
  Layers,
} from 'lucide-react';
import { NoteItem, NoteSummaryResponse } from '../types';

interface NotesViewProps {
  notes: NoteItem[];
  onSaveNote: (note: NoteItem) => void;
  onDeleteNote: (noteId: string) => void;
  onVoiceSummarizePrompt: () => void;
  autoSummarizeTrigger?: boolean;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onVoiceSummarizePrompt,
  autoSummarizeTrigger = false,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  // Editing state
  const [activeTitle, setActiveTitle] = useState('');
  const [activeSubject, setActiveSubject] = useState('Python');
  const [activeContent, setActiveContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Summarizer state
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState<NoteSummaryResponse | null>(null);
  const [isSummaryDrawerOpen, setIsSummaryDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  useEffect(() => {
    if (selectedNote) {
      setActiveTitle(selectedNote.title);
      setActiveSubject(selectedNote.subject);
      setActiveContent(selectedNote.content);
    }
  }, [selectedNoteId]);

  // Auto trigger summarization if requested via voice command e.g. "Summarize my notes"
  useEffect(() => {
    if (autoSummarizeTrigger && selectedNote) {
      handleGenerateSummary();
    }
  }, [autoSummarizeTrigger]);

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'all' || n.subject === selectedSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNewNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New Study Note',
      subject: 'Python',
      content: 'Write your lecture notes, core definitions, or code syntax here...',
      updatedAt: 'Just now',
      tags: ['Study', 'Draft'],
    };
    onSaveNote(newNote);
    setSelectedNoteId(newNote.id);
    setIsEditing(true);
  };

  const handleSaveCurrentNote = () => {
    if (!selectedNote) return;
    const updated: NoteItem = {
      ...selectedNote,
      title: activeTitle,
      subject: activeSubject,
      content: activeContent,
      updatedAt: 'Just now',
    };
    onSaveNote(updated);
    setIsEditing(false);
  };

  const handleGenerateSummary = async () => {
    if (!selectedNote) return;
    setIsSummarizing(true);
    setIsSummaryDrawerOpen(true);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedNote.title,
          subject: selectedNote.subject,
          content: selectedNote.content,
        }),
      });

      if (!res.ok) throw new Error('Summarization request failed');
      const data: NoteSummaryResponse = await res.json();
      setSummaryData(data);
    } catch (err) {
      console.warn('Fallback summarization utilized:', err);
      // Client-side fallback
      const sentences = selectedNote.content
        .split(/[.!?\n]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20);

      setSummaryData({
        summary: sentences.slice(0, 3).join('. ') + '.',
        keyPoints: sentences.slice(0, 4),
        flashcards: [
          {
            front: `Core principle of ${selectedNote.title}`,
            back: sentences[0] || 'Understand foundational definitions and implementation details.',
          },
        ],
        source: 'local_fallback',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const copySummaryToClipboard = () => {
    if (!summaryData) return;
    const text = `STUDY SUMMARY: ${selectedNote?.title}\n\n${summaryData.summary}\n\nKEY TAKEAWAYS:\n${summaryData.keyPoints.map((p) => `• ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Revision & Knowledge Base</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Notes & AI Synthesis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Read, edit, or summarize notes with Gemini AI via &ldquo;Summarize my notes&rdquo;.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onVoiceSummarizePrompt}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span>&ldquo;Summarize my notes&rdquo;</span>
          </button>

          <button
            onClick={handleCreateNewNote}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Two-Pane Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Pane (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes or concepts..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          {/* Subject pills filter */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
            {['all', 'Python', 'Data Structures', 'Web Development', 'Machine Learning'].map(
              (subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectFilter(subj)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap text-[11px] transition-colors ${
                    selectedSubjectFilter === subj
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {subj === 'all' ? 'All' : subj}
                </button>
              )
            )}
          </div>

          {/* Notes items */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = note.id === selectedNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsEditing(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                      {note.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">{note.updatedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{note.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{note.content}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Note Detail / Editor Pane (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4 min-h-[560px]">
          {selectedNote ? (
            <>
              <div>
                {/* Note Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {activeSubject}
                    </span>
                    <span className="text-xs text-slate-400">• Last saved {selectedNote.updatedAt}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Summarize Action Button */}
                    <button
                      id="summarize-notes-btn"
                      onClick={handleGenerateSummary}
                      disabled={isSummarizing}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                      title="Generate AI summary of these notes"
                    >
                      {isSummarizing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                          <span>Summarize with AI</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteNote(selectedNote.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title and Content Input */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={activeTitle}
                    onChange={(e) => {
                      setActiveTitle(e.target.value);
                      setIsEditing(true);
                    }}
                    placeholder="Note Title"
                    className="w-full text-xl font-extrabold text-slate-900 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors pb-1"
                  />

                  <textarea
                    rows={15}
                    value={activeContent}
                    onChange={(e) => {
                      setActiveContent(e.target.value);
                      setIsEditing(true);
                    }}
                    placeholder="Type your notes here..."
                    className="w-full text-xs md:text-sm text-slate-800 leading-relaxed bg-transparent border-0 focus:outline-none resize-y font-mono whitespace-pre-wrap"
                  />
                </div>
              </div>

              {/* Save Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isEditing ? 'Unsaved modifications' : 'All changes saved to workspace'}
                </span>

                {isEditing && (
                  <button
                    onClick={handleSaveCurrentNote}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-slate-400">
              <FileText className="w-12 h-12 text-slate-200 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No note selected</p>
              <p className="text-xs mt-1">Select a note from the left or create a new one.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI SUMMARY DRAWER / MODAL */}
      {isSummaryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Note Synthesis</h3>
                  <p className="text-xs text-slate-500">Gemini-powered executive study summary</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copySummaryToClipboard}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center space-x-1"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setIsSummaryDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-left">
              {isSummarizing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                  <p className="text-sm font-bold text-slate-900">Generating Study Summary...</p>
                  <p className="text-xs text-slate-500 mt-1">Extracting core principles and generating flashcards</p>
                </div>
              ) : summaryData ? (
                <>
                  {/* Executive Overview */}
                  <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                    <span className="text-[11px] uppercase font-bold text-indigo-700 block mb-1">
                      Executive Overview
                    </span>
                    <p className="text-xs md:text-sm text-slate-800 leading-relaxed">
                      {summaryData.summary}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Key Takeaways & Formulas
                    </h4>
                    <div className="space-y-2">
                      {summaryData.keyPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Revision Flashcards */}
                  {summaryData.flashcards && summaryData.flashcards.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Rapid Recall Flashcards
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {summaryData.flashcards.map((fc, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-indigo-200/80 bg-white shadow-2xs space-y-2"
                          >
                            <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              Q{idx + 1}
                            </span>
                            <p className="text-xs font-bold text-slate-900">{fc.front}</p>
                            <p className="text-xs text-slate-600 pt-1 border-t border-slate-100">
                              {fc.back}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Synthesized using Scirian Study Companion Engine</span>
              <button
                onClick={() => setIsSummaryDrawerOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
