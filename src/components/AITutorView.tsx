import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  BookOpen,
  Brain,
  RefreshCw,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, BookItem } from '../types';
import { speechService } from '../services/voiceService';

interface AITutorViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  activeBook?: BookItem;
  onVoicePromptClick: (text: string) => void;
}

export function AITutorView({
  messages,
  onSendMessage,
  isProcessing,
  activeBook,
  onVoicePromptClick,
}: AITutorViewProps) {
  const [inputText, setInputText] = useState('');
  const [isListeningForTutor, setIsListeningForTutor] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState('Computer Science & Distributed Systems');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Read latest assistant message aloud if TTS enabled
  useEffect(() => {
    if (!ttsEnabled || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'assistant' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastMsg.content);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        // silent
      }
    }
  }, [messages, ttsEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleStartVoiceTutor = () => {
    if (isListeningForTutor) {
      speechService.stopListening();
      setIsListeningForTutor(false);
      return;
    }

    setIsListeningForTutor(true);
    speechService.startListening({
      onInterim: (text) => {
        setInputText(text);
      },
      onFinal: (finalText) => {
        setIsListeningForTutor(false);
        setInputText(finalText);
        if (finalText.trim()) {
          onSendMessage(finalText.trim());
          setInputText('');
        }
      },
      onError: (err) => {
        setIsListeningForTutor(false);
      },
    });
  };

  const promptSuggestions = [
    'How does single-leader replication handle failover without split-brain?',
    'Explain the mathematical proof that BFS guarantees shortest unweighted path.',
    'What is the difference between synchronous and asynchronous consensus?',
    'Why is ReLU preferred over Sigmoid in deep neural networks?',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Scirian AI Voice Tutor
              <span className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 px-2 py-0.5 rounded-full">
                Interactive Learning
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Speak or chat naturally with your personalized academic copilot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* TTS Audio Read-aloud Toggle */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              ttsEnabled
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Read answers aloud using speech synthesis"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{ttsEnabled ? 'Voice Output ON' : 'Voice Output OFF'}</span>
          </button>

          {/* Active Book Context Pill */}
          {activeBook && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className="truncate max-w-[160px]">{activeBook.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Thread Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[540px]">
        {/* Messages scroll area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
                <div
                  className={`mt-2 text-[10px] flex items-center justify-between ${
                    msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utt = new SpeechSynthesisUtterance(msg.content);
                          window.speechSynthesis.speak(utt);
                        }
                      }}
                      className="hover:text-indigo-500 p-0.5 rounded transition-colors"
                      title="Replay speech"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>AI Tutor is formulating an academic explanation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Suggestions:
          </span>
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt)}
              className="text-[11px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Input Form with Mic Button */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3"
        >
          {/* Voice Input Trigger */}
          <button
            type="button"
            onClick={handleStartVoiceTutor}
            className={`p-3 rounded-xl transition-all shadow-sm flex items-center justify-center ${
              isListeningForTutor
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/40'
            }`}
            title={isListeningForTutor ? 'Stop listening' : 'Speak to AI Tutor'}
          >
            {isListeningForTutor ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListeningForTutor
                ? 'Listening to your question...'
                : 'Type an academic concept or ask a study question...'
            }
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
