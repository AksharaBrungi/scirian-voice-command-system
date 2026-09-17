import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Sparkles,
  Filter,
  Trash2,
  Tag,
  Mic,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { StudyTask } from '../types';

interface StudyPlanViewProps {
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<StudyTask, 'id' | 'completed'>) => void;
  onDeleteTask: (taskId: string) => void;
  onVoiceAddPrompt: () => void;
  prefilledTitle?: string;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onVoiceAddPrompt,
  prefilledTitle = '',
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState(prefilledTitle);
  const [newSubject, setNewSubject] = useState('Python');
  const [newTime, setNewTime] = useState('03:00 PM');
  const [newDuration, setNewDuration] = useState(45);
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const subjects = ['all', 'Python', 'Data Structures', 'Machine Learning', 'Web Development'];

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterSubject !== 'all' && task.subject !== filterSubject) return false;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.completed ? t.durationMinutes : 0), 0);
  const plannedMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      subject: newSubject,
      time: newTime,
      durationMinutes: Number(newDuration),
      priority: newPriority,
    });
    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Schedule & Timetable</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Plan Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize study blocks, monitor task completion, or schedule sessions via voice command.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onVoiceAddPrompt}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span>Voice Add Task</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Task</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">
            Completed Tasks
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">{completedCount}</span>
            <span className="text-xs text-slate-500">/ {tasks.length} total tasks</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">
            Focused Study Time
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-indigo-600">
              {(totalMinutes / 60).toFixed(1)} hrs
            </span>
            <span className="text-xs text-slate-500">
              of {(plannedMinutes / 60).toFixed(1)} hrs planned
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">
            Voice Automation Trigger
          </span>
          <p className="text-xs font-semibold text-slate-800 mt-1 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>&ldquo;Add Python to my study plan&rdquo;</span>
          </p>
        </div>
      </div>

      {/* Filter & Action Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          {(['all', 'pending', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {status} ({status === 'all' ? tasks.length : status === 'pending' ? tasks.length - completedCount : completedCount})
            </button>
          ))}
        </div>

        {/* Subject filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Subject:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Subjects' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No study tasks found</h4>
            <p className="text-xs text-slate-400 mt-1">
              Add a new task above or say &ldquo;Create a study plan&rdquo; into the microphone.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50/80 border-slate-200/90 text-slate-400'
                  : 'bg-white border-slate-200/90 hover:border-indigo-200 hover:shadow-2xs text-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`shrink-0 cursor-pointer ${
                    task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-600'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-100 text-emerald-600" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="overflow-hidden">
                  <p
                    className={`text-sm font-semibold truncate ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-3 mt-1 text-xs">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[11px]">
                      {task.subject}
                    </span>
                    <span className="text-slate-400 flex items-center space-x-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{task.time}</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Duration: {task.durationMinutes} mins
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    task.priority === 'high'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : task.priority === 'medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.priority}
                </span>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Study Task</h3>
            <p className="text-xs text-slate-500 mb-4">
              Schedule a focused review or practice block.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Review Tree Traversals & LeetCode 104"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  >
                    <option value="Python">Python</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 03:00 PM"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
