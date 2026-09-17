import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Send,
  HelpCircle,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { AllowedIntent, CommandParameters, VoiceState } from '../types';
import { SAMPLE_VOICE_PROMPTS } from '../data/mockData';

interface VoiceAssistantCenterpieceProps {
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
  onSubmitCommand: (commandText: string) => void;
  onOpenHelp: () => void;
  onReset: () => void;
}

export const VoiceAssistantCenterpiece: React.FC<VoiceAssistantCenterpieceProps> = ({
  voiceState,
  transcript,
  interimTranscript,
  lastIntent,
  lastParameters = {},
  lastConfidence = 0.95,
  lastActionSummary,
  errorMessage,
  audioLevel,
  onStartListening,
  onStopListening,
  onSubmitCommand,
  onOpenHelp,
  onReset,
}) => {
  const [manualInput, setManualInput] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onSubmitCommand(manualInput.trim());
    setManualInput('');
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden transition-all">
      {/* Background Subtle Accent Aura */}
      <div
        className={`absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          voiceState === 'listening'
            ? 'bg-rose-400/20 opacity-100'
            : voiceState === 'processing'
            ? 'bg-indigo-400/25 opacity-100'
            : voiceState === 'result'
            ? 'bg-emerald-400/20 opacity-100'
            : 'bg-indigo-200/20 opacity-40'
        }`}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Scirian Intelligent Voice Pipeline</span>
            </span>
          </div>
          <button
            onClick={onOpenHelp}
            className="flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Voice Manual</span>
          </button>
        </div>

        {/* 1. IDLE STATE */}
        {voiceState === 'idle' && (
          <div className="py-3 flex flex-col items-center w-full max-w-xl">
            {/* Big Pulsing Mic Button */}
            <div className="relative group cursor-pointer my-2" onClick={onStartListening}>
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full opacity-30 group-hover:opacity-60 blur-md transition duration-300 animate-pulse" />
              <button
                id="dashboard-mic-btn"
                className="relative w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                title="Click to speak"
              >
                <Mic className="w-9 h-9 text-white" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-3">Voice Command</h3>
            <p className="text-sm text-slate-500 max-w-md mt-1">
              Click the microphone to speak, or select any natural student productivity command below.
            </p>

            {/* Quick Demo Chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5 w-full">
              {SAMPLE_VOICE_PROMPTS.slice(0, 5).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSubmitCommand(prompt.text)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-300 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Mic className="w-3 h-3 text-slate-400" />
                  <span>&ldquo;{prompt.text}&rdquo;</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. LISTENING STATE */}
        {voiceState === 'listening' && (
          <div className="py-4 flex flex-col items-center w-full max-w-xl">
            {/* Active Recording Animated Mic */}
            <div className="relative my-2">
              <div
                className="absolute -inset-4 bg-rose-500/30 rounded-full blur-lg animate-ping"
                style={{ animationDuration: '1.8s' }}
              />
              <div
                className="absolute -inset-2 bg-rose-500/40 rounded-full blur-md"
                style={{
                  transform: `scale(${1 + audioLevel * 0.4})`,
                  transition: 'transform 0.1s ease-out',
                }}
              />
              <button
                onClick={onStopListening}
                className="relative w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-all cursor-pointer"
                title="Click to stop listening"
              >
                <Square className="w-7 h-7 fill-white text-white" />
              </button>
            </div>

            <div className="flex items-center space-x-2 mt-3 text-rose-600 font-semibold text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              <span>Listening for speech...</span>
            </div>

            {/* Audio Waveform Visualization Bars */}
            <div className="flex items-center justify-center space-x-1.5 my-3 h-8">
              {[40, 70, 90, 60, 100, 75, 45, 85, 60, 95, 50].map((h, i) => {
                const dynamicHeight = Math.max(8, h * (0.3 + audioLevel * 0.9));
                return (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-rose-500 transition-all duration-75"
                    style={{ height: `${dynamicHeight}px` }}
                  />
                );
              })}
            </div>

            {/* Live Transcription Box */}
            <div className="w-full max-w-md p-3.5 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-inner flex items-center justify-center min-h-[52px]">
              {interimTranscript ? (
                <p className="text-slate-100 italic animate-pulse">
                  &ldquo;{interimTranscript}&rdquo;
                </p>
              ) : (
                <p className="text-slate-400 text-xs">
                  Speak now... e.g. &ldquo;Start a Python quiz with 10 questions&rdquo;
                </p>
              )}
            </div>

            <button
              onClick={onStopListening}
              className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              Stop recording
            </button>
          </div>
        )}

        {/* 3. PROCESSING STATE */}
        {voiceState === 'processing' && (
          <div className="py-5 flex flex-col items-center w-full max-w-xl">
            <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center relative my-2">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-3">Understanding your command...</h3>
            <p className="text-xs text-slate-500 mt-1">
              Extracting intent and matching parameters via NLU engine...
            </p>

            <div className="w-full max-w-md p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-sm font-medium mt-4">
              <span className="text-xs text-slate-400 block mb-0.5">Transcribed speech:</span>
              &ldquo;{transcript}&rdquo;
            </div>
          </div>
        )}

        {/* 4. RESULT STATE */}
        {voiceState === 'result' && (
          <div className="py-4 flex flex-col items-center w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Command Recognized</h3>

            {/* Results Grid Card */}
            <div className="w-full max-w-lg mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
              <div className="flex items-start justify-between border-b border-slate-200/80 pb-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                    You said:
                  </span>
                  <p className="text-sm font-semibold text-slate-900">&ldquo;{transcript}&rdquo;</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Confidence
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {(lastConfidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Intent:</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {lastIntent}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Action:</span>
                  <span className="font-medium text-slate-800 flex items-center space-x-1">
                    <ArrowRight className="w-3 h-3 text-emerald-500 inline" />
                    <span>{lastActionSummary || 'Navigating module...'}</span>
                  </span>
                </div>
              </div>

              {/* Extracted Parameters if any */}
              {lastParameters && Object.keys(lastParameters).length > 0 && (
                <div className="pt-1.5 border-t border-slate-200/70">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                    Extracted Parameters:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(lastParameters).map(([k, v]) => (
                      <span
                        key={k}
                        className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/70 text-slate-800 border border-slate-300/80"
                      >
                        {k}: <strong>{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Done
              </button>
              <button
                onClick={onStartListening}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Speak Another Command</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. ERROR STATE */}
        {voiceState === 'error' && (
          <div className="py-4 flex flex-col items-center w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">I couldn't understand that command</h3>
            <p className="text-xs text-rose-600 font-medium mt-1 max-w-md">
              {errorMessage || 'Unknown command or speech could not be recognized.'}
            </p>

            {/* Suggestions & Examples */}
            <div className="w-full max-w-lg mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Supported commands you can try right now:
              </p>
              <div className="space-y-1.5">
                {[
                  'Start a Python quiz with 10 questions',
                  'Create a study plan',
                  'Summarize my notes',
                  'Open my analytics',
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSubmitCommand(s)}
                    className="w-full text-left text-xs p-2 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-colors flex items-center justify-between"
                  >
                    <span>&ldquo;{s}&rdquo;</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={onStartListening}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={onOpenHelp}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                View Full Command List
              </button>
            </div>
          </div>
        )}

        {/* Manual Command Input Fallback Form (Always Available for Testing/Resilience) */}
        <div className="w-full max-w-lg mt-6 pt-4 border-t border-slate-100">
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="voice-command-text-input"
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Or type a natural command (e.g. 'Start a Python quiz with 10 questions')..."
                className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 text-white flex items-center space-x-1 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <span>Execute</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
