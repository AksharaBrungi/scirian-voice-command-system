import React, { useState } from 'react';
import {
  Mic,
  Square,
  Sparkles,
  X,
  Send,
  HelpCircle,
  Volume2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { AllowedIntent, CommandParameters, VoiceState, VoiceCommandContext } from '../types';
import { SAMPLE_VOICE_PROMPTS } from '../data/mockData';

interface GlobalVoiceAssistantProps {
  voiceState: VoiceState;
  transcript: string;
  interimTranscript: string;
  lastIntent?: AllowedIntent;
  lastParameters?: CommandParameters;
  lastActionSummary?: string;
  audioLevel: number;
  errorMessage?: string;
  context?: VoiceCommandContext;
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmitCommand: (text: string) => void;
  onOpenHelp: () => void;
}

export const GlobalVoiceAssistant: React.FC<GlobalVoiceAssistantProps> = ({
  voiceState,
  transcript,
  interimTranscript,
  lastIntent,
  lastParameters,
  lastActionSummary,
  audioLevel,
  errorMessage,
  context,
  onStartListening,
  onStopListening,
  onSubmitCommand,
  onOpenHelp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const isRecording = voiceState === 'listening';

  const handleMicClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      onStartListening();
    } else {
      if (isRecording) {
        onStopListening();
      } else {
        onStartListening();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSubmitCommand(inputVal.trim());
    setInputVal('');
  };

  // Select context-relevant prompts
  const contextualPrompts = SAMPLE_VOICE_PROMPTS.filter((p) => {
    if (!context) return true;
    if (context.activeTab === 'reader') return p.context === 'reader' || p.context === 'global';
    if (context.activeTab === 'notes') return p.context === 'notes' || p.context === 'global';
    return p.context === 'global';
  }).slice(0, 4);

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2">
        <button
          id="global-voice-trigger-btn"
          onClick={handleMicClick}
          className={`flex items-center space-x-2.5 px-4 py-3 rounded-full font-semibold text-sm shadow-xl transition-all cursor-pointer ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-rose-600/30'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
          }`}
          title="Global Voice Command"
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4 fill-white text-white" />
              <span>Listening...</span>
              <span className="flex space-x-0.5 items-center h-3">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-1 bg-white rounded-full transition-all"
                    style={{ height: `${Math.max(4, 12 * (audioLevel + 0.3))}px` }}
                  />
                ))}
              </span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-white" />
              <span>Voice OS</span>
            </>
          )}
        </button>
      </div>

      {/* Slide-over Voice Control Panel / Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-5 flex flex-col space-y-4 animate-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isRecording
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Scirian Voice OS</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Context-aware speech pipeline</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={onOpenHelp}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Voice guide"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (isRecording) onStopListening();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Context Awareness Badge */}
            {context && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 text-[11px]">
                <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-medium truncate">
                  <Layers className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span className="truncate">
                    Active Context: <strong>{context.activeTab.toUpperCase()}</strong>
                    {context.currentBookTitle ? ` • ${context.currentBookTitle}` : ''}
                  </span>
                </div>
                <span className="text-[10px] text-indigo-500 font-semibold uppercase">Smart NLU</span>
              </div>
            )}

            {/* Live Interactive State */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2 min-h-[110px] justify-center">
              {isRecording ? (
                <>
                  <div className="flex items-center space-x-1 h-5">
                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                      <span
                        key={bar}
                        className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                        style={{
                          height: `${Math.max(6, 24 * Math.sin(bar + audioLevel * 10)) * (audioLevel + 0.4)}px`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Listening to spoken command...
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white italic max-w-sm">
                    {interimTranscript || transcript || 'Speak your request clearly'}
                  </p>
                </>
              ) : voiceState === 'processing' ? (
                <>
                  <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Understanding natural language intent...
                  </p>
                  <p className="text-xs text-slate-500 italic max-w-sm">"{transcript}"</p>
                </>
              ) : voiceState === 'result' ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{lastActionSummary || 'Command Executed'}</p>
                  {lastIntent && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      Intent: {lastIntent}
                    </span>
                  )}
                </>
              ) : voiceState === 'error' ? (
                <>
                  <AlertCircle className="w-6 h-6 text-rose-500" />
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                    {errorMessage || 'Command could not be recognized.'}
                  </p>
                </>
              ) : (
                <>
                  <button
                    onClick={onStartListening}
                    className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tap to speak</p>
                </>
              )}
            </div>

            {/* Quick Contextual Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Suggested in current view:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {contextualPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSubmitCommand(p.text);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700 transition-colors"
                  >
                    "{p.text}"
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Text Command Fallback */}
            <form onSubmit={handleSubmit} className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Or type command: e.g. Open my library..."
                className="flex-1 px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
