import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  Calendar,
  Mic,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface AnalyticsViewProps {
  profile: StudentProfile;
  completedTasksCount: number;
  totalTasksCount: number;
  onVoiceTriggerPrompt?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  profile,
  completedTasksCount,
  totalTasksCount,
  onVoiceTriggerPrompt,
}) => {
  const weeklyData = [
    { day: 'Mon', hours: 4.2, target: 4.5 },
    { day: 'Tue', hours: 5.0, target: 4.5 },
    { day: 'Wed', hours: 3.8, target: 4.5 },
    { day: 'Thu', hours: 4.8, target: 4.5 },
    { day: 'Fri', hours: 5.5, target: 4.5 },
    { day: 'Sat', hours: 3.0, target: 4.0 },
    { day: 'Sun', hours: 2.2, target: 3.5 },
  ];

  const maxHours = Math.max(...weeklyData.map((d) => d.hours));

  const subjects = [
    { name: 'Python', score: 92, quizzes: 6, color: 'bg-indigo-600', badge: 'Mastery' },
    { name: 'Data Structures', score: 85, quizzes: 4, color: 'bg-blue-600', badge: 'Proficient' },
    { name: 'Web Development', score: 89, quizzes: 3, color: 'bg-emerald-600', badge: 'Proficient' },
    { name: 'Machine Learning', score: 78, quizzes: 3, color: 'bg-amber-600', badge: 'Practicing' },
  ];

  const recentQuizHistory = [
    { date: 'Today, 9:42 AM', subject: 'Python', score: 10, total: 10, percent: 100 },
    { date: 'Yesterday', subject: 'Data Structures', score: 4, total: 5, percent: 80 },
    { date: 'Sep 13', subject: 'Web Development', score: 3, total: 3, percent: 100 },
    { date: 'Sep 11', subject: 'Machine Learning', score: 4, total: 5, percent: 80 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Academic Performance Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learning Analytics & Insights
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual breakdown of study hours, quiz accuracy, and weekly progress curves.
          </p>
        </div>

        <button
          onClick={onVoiceTriggerPrompt}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Mic className="w-3.5 h-3.5 text-indigo-600" />
          <span>&ldquo;Show my progress&rdquo;</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Study Hours
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">28.5 hrs</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3 inline" /> +14%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">This week vs last week</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quiz Accuracy
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">87.4%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3 inline" /> +5.2%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across 16 practice sessions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tasks Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">32 Tasks</span>
            <span className="text-xs font-semibold text-slate-500">91% completion rate</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Scheduled study tasks</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{profile.streakDays} Days</span>
            <span className="text-xs font-bold text-amber-600">Personal Best</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Consistent daily learning</p>
        </div>
      </div>

      {/* Two Column Section: Weekly Bar Chart & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Hours Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Study Hours</h3>
              <p className="text-xs text-slate-500">Actual study hours vs daily target</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-indigo-600" />
                <span>Actual</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-400">
                <span className="w-3 h-3 rounded-xs border border-dashed border-slate-400" />
                <span>Target</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-8 pb-2 flex items-end justify-between h-52 px-2 border-b border-slate-100">
            {weeklyData.map((d, i) => {
              const heightPercent = Math.round((d.hours / 6) * 100);
              const isToday = d.day === 'Tue';
              return (
                <div key={i} className="flex flex-col items-center flex-1 space-y-2 group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.hours}h
                  </span>

                  <div className="w-8 sm:w-10 bg-slate-100 rounded-t-lg h-40 flex items-end justify-center p-0.5 relative">
                    {/* Target marker line */}
                    <div
                      className="absolute w-full border-t border-dashed border-slate-400 pointer-events-none"
                      style={{ bottom: `${(d.target / 6) * 100}%` }}
                    />
                    {/* Bar fill */}
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isToday ? 'bg-indigo-600' : 'bg-indigo-500/80 hover:bg-indigo-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      isToday ? 'text-indigo-600 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Weekly Average: <strong>4.1 hrs/day</strong></span>
            <span className="text-emerald-600 font-semibold">Target achieved 5 of 7 days</span>
          </div>
        </div>

        {/* Subject Performance Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Subject Mastery</h3>
              <p className="text-xs text-slate-500">Average assessment score by discipline</p>
            </div>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-4">
            {subjects.map((subj) => (
              <div key={subj.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{subj.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {subj.quizzes} Quizzes
                    </span>
                    <span className="font-mono font-bold text-slate-900">{subj.score}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${subj.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${subj.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Top Performing: <strong className="text-indigo-600">Python (92%)</strong></span>
            <span className="text-slate-400 font-medium">Updated today</span>
          </div>
        </div>
      </div>

      {/* Recent Quiz Logs Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Assessment History</h3>
            <p className="text-xs text-slate-500">Logged test attempts and diagnostic scores</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Percentage</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentQuizHistory.map((q, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-semibold text-slate-900">{q.subject}</td>
                  <td className="py-3 px-3 text-slate-500">{q.date}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {q.score} / {q.total}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-indigo-600">{q.percent}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        q.percent >= 80
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {q.percent >= 80 ? 'Passed' : 'Needs Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
