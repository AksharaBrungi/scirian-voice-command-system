import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Upload,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  Filter,
  Bookmark,
  X,
} from 'lucide-react';
import { BookItem } from '../types';

interface LibraryViewProps {
  books: BookItem[];
  onSelectBook: (bookId: string) => void;
  onAddBook: (newBook: BookItem) => void;
  onVoicePromptClick: (text: string) => void;
}

export function LibraryView({
  books,
  onSelectBook,
  onAddBook,
  onVoicePromptClick,
}: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload simulation state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Computer Science');
  const [isDragging, setIsDragging] = useState(false);

  const categories = ['All', 'System Architecture', 'Computer Science', 'Artificial Intelligence', 'Software Engineering'];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newBook: BookItem = {
      id: `book-${Date.now()}`,
      title: uploadTitle,
      author: uploadAuthor.trim() || 'Uploaded Document',
      coverGradient: 'from-cyan-600 via-blue-700 to-slate-900',
      category: uploadCategory,
      totalPages: 120,
      currentPage: 1,
      progressPercent: 0,
      lastReadAt: 'Just uploaded',
      fileSize: '5.2 MB',
      summary: `User uploaded academic material: ${uploadTitle}. Indexed for AI Copilot explanations, chapter quizzes, and flashcards.`,
      chapters: [
        {
          id: `c-${Date.now()}`,
          title: 'Chapter 1: Overview and Core Principles',
          pageStart: 1,
          excerpt: 'Introductory concepts and foundational architecture of this uploaded document.',
          fullText: `This is the synthesized study content for ${uploadTitle}. You can activate the Scirian Voice Assistant to ask questions such as "Explain this section", "Summarize this page", or "Generate a quiz from this book".`,
          keyConcepts: ['Foundational Theory', 'Key Terminology', 'Synthesized Notes'],
        },
      ],
    };

    onAddBook(newBook);
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadAuthor('');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                My Learning Library
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Textbooks, research papers, and lectures indexed with AI Copilot
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-upload-document"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Upload className="w-4 h-4" />
            Upload Book / PDF
          </button>
        </div>
      </div>

      {/* Voice Assistant Shortcut Pill */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200/60 dark:border-indigo-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span>
            <strong>Voice tip in Library:</strong> Speak <code className="bg-white/80 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono">"Continue reading"</code> or click any book to launch the reader.
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onVoicePromptClick('Continue reading')}
            className="text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Try: "Continue reading"
          </button>
          <button
            onClick={() => onVoicePromptClick('Explain this section')}
            className="text-xs bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Try: "Explain this section"
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, authors, or subjects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            id={`book-card-${book.id}`}
            onClick={() => onSelectBook(book.id)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Book Cover Header */}
            <div className={`h-44 bg-gradient-to-br ${book.coverGradient} p-5 flex flex-col justify-between relative overflow-hidden`}>
              <div className="flex items-center justify-between text-white/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
                  {book.category}
                </span>
                <span className="text-[11px] font-mono text-white/90">
                  p. {book.currentPage}/{book.totalPages}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug group-hover:text-indigo-100 transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-white/70 mt-1 font-medium">{book.author}</p>
              </div>

              {/* Decorative page corner */}
              <div className="absolute right-0 bottom-0 w-8 h-8 bg-black/20 transform rotate-45 translate-x-4 translate-y-4" />
            </div>

            {/* Book Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {book.summary}
              </p>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Completion</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {book.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${book.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Footer details */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {book.lastReadAt}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBook(book.id);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform"
                >
                  Continue Reading
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Simulation Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">Upload Book or Paper</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dropzone Simulation */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (!uploadTitle) setUploadTitle('Distributed Consensus in Cloud Computing.pdf');
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Drag and drop your PDF or ePub here
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, ePub, or TXT up to 50MB</p>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Document / Book Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus in Cloud Computing"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Author / Organization
                </label>
                <input
                  type="text"
                  value={uploadAuthor}
                  onChange={(e) => setUploadAuthor(e.target.value)}
                  placeholder="e.g. Leslie Lamport"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="System Architecture">System Architecture</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-confirm-upload"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                >
                  Index & Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
