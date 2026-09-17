import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Bot,
  Brain,
  CalendarCheck,
  GraduationCap,
  FileText,
  BarChart3,
  HelpCircle,
  Flame,
  Volume2,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { PageTab, StudentProfile } from '../types';

interface NavigationProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  profile: StudentProfile;
  onOpenHelp: () => void;
  voiceActive?: boolean;
  onSignOut?: () => void;
  contextTitle?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenHelp,
  voiceActive = false,
  onSignOut,
  contextTitle,
}) => {
  const navItems = [
    { id: 'dashboard' as PageTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library' as PageTab, label: 'My Library', icon: BookOpen, badge: '4 Books' },
    { id: 'reader' as PageTab, label: 'Book Reader', icon: BookMarked, badge: 'Active' },
    { id: 'ai-tutor' as PageTab, label: 'AI Voice Tutor', icon: Bot, badge: 'Voice' },
    { id: 'daily-recall' as PageTab, label: 'Daily Recall', icon: Brain, badge: '5 due' },
    { id: 'study-plan' as PageTab, label: 'Study Plan', icon: CalendarCheck },
    { id: 'quiz' as PageTab, label: 'Practice Quiz', icon: GraduationCap },
    { id: 'notes' as PageTab, label: 'Study Notes', icon: FileText },
    { id: 'analytics' as PageTab, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
      {/* Brand & Logo */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>Scirian</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Voice OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Smart Learning Workspace</p>
          </div>
        </div>
      </div>

      {/* Real-time Context Pill */}
      <div className="px-3 pt-3 pb-1">
        <div
          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
            voiceActive
              ? 'bg-rose-950/40 border-rose-600/40 text-rose-300'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    voiceActive ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    voiceActive ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="font-semibold">{voiceActive ? 'Listening...' : 'Voice Engine Ready'}</span>
            </div>
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {contextTitle && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-700/50 text-[11px] text-indigo-300 truncate">
              <span className="text-slate-400 font-mono">ctx:</span> {contextTitle}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-3 py-2 flex-1 space-y-1 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Learning Workspace
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-indigo-700/80 text-indigo-100'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3">
          <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Assistance
          </p>
          <button
            id="nav-btn-help"
            onClick={onOpenHelp}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all text-left"
          >
            <div className="flex items-center space-x-2.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Voice Commands</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Contextual
            </span>
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-750">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/40 flex-shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{profile.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{profile.major}</p>
            </div>
          </div>
          <div
            className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold flex-shrink-0"
            title="Daily Study Streak"
          >
            <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{profile.streakDays}d</span>
          </div>
        </div>

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out / Switch User
          </button>
        )}
      </div>
    </aside>
  );
};
