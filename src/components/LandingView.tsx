import React, { useState } from 'react';
import {
  Mic,
  BookOpen,
  Sparkles,
  Brain,
  CheckCircle2,
  ArrowRight,
  Headphones,
  FileText,
  Shield,
  Layers,
  ChevronRight,
  Play,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface LandingViewProps {
  onLoginDemo: () => void;
  onOpenVoiceGuide: () => void;
  profile: StudentProfile;
}

export function LandingView({ onLoginDemo, onOpenVoiceGuide, profile }: LandingViewProps) {
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [emailInput, setEmailInput] = useState('alex.chen@scirian.edu');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginDemo();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                SCIRIAN <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">VOICE OS</span>
              </span>
              <p className="text-[11px] text-slate-400 leading-none">Smart Learning Workspace & Voice Command System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenVoiceGuide}
              className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-400" />
              Voice Commands
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className="text-xs font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onLoginDemo}
              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Demo Workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Product Value Proposition */}
        <div className="flex-1 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Operating System designed for Smart Learning
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Read smarter with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">AI Voice Copilot</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Consolidate your textbooks, research papers, lecture notes, and active recall into one unified workspace. Navigate hands-free with real-time natural voice commands or full manual controls.
          </p>

          {/* Voice Prompt Highlights */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Mic className="w-4 h-4 text-indigo-400" />
                Spoken Voice Commands Supported Everywhere
              </span>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">Zero latency</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="font-mono text-indigo-300">"Open my library"</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-emerald-300">"Explain this section"</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="font-mono text-sky-300">"Start a Python quiz"</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="font-mono text-amber-300">"Review daily recall"</span>
              </div>
            </div>
          </div>

          {/* Quick Feature Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Smart Library</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>AI Voice Tutor</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Brain className="w-4 h-4 text-sky-400" />
              <span>Daily Recall</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Adaptive Planner</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card & Demo Entry */}
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Your Account' : 'Student Access'}
                </h2>
                <p className="text-xs text-slate-400">Step into the Scirian Voice workspace</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${authMode === 'login' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${authMode === 'signup' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Quick Demo Login Option (Prominent as per spec) */}
            <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-left space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover border border-indigo-400/50"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{profile.name}</h3>
                    <p className="text-xs text-indigo-300">{profile.major} • {profile.semester}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  PRELOADED DEMO
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Includes 4 textbooks, 18 quizzes, active notes, and full speech-to-text context engine.
              </p>
              <button
                id="btn-continue-demo-user"
                onClick={onLoginDemo}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
              >
                Continue as Alex Chen (Demo)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                or sign in manually
              </span>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Student Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="student@university.edu"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                id="btn-enter-workspace"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                Enter Scirian Workspace
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </form>

            <p className="mt-4 text-[11px] text-center text-slate-500">
              Prototype demo mode • Voice data processed securely on client & server
            </p>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Scirian Voice Command System • Smart Learning Ecosystem</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Privacy-First Speech Engine
            </span>
            <span>Web Speech API + Gemini NLU</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
