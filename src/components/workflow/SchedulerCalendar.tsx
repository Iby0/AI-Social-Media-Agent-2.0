import React, { useState } from 'react';
import { useScheduler } from '../../hooks/useScheduler';
import { ScheduleFrequency, TaskType } from '../../types/workflow';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Plus,
  Trash2,
  Power,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const SchedulerCalendar: React.FC = () => {
  const { schedules, addSchedule, toggleSchedule, deleteSchedule } = useScheduler();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<ScheduleFrequency>('Daily');
  const [taskType, setTaskType] = useState<TaskType>('Publish Preparation');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState('09:00');
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addSchedule(title, frequency, taskType, customDate, customTime, timezone);
    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            Timezone-Aware Schedule Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated recurring and one-time workflow execution triggers across global timezones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          New Schedule Rule
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-dashed border-slate-800 rounded-xl space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No Active Schedules</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a schedule rule to trigger recurring or custom post preparation tasks automatically.
            </p>
          </div>
        ) : (
          schedules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                rule.isActive
                  ? 'bg-slate-950 border-slate-800 hover:border-blue-500/60'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white">{rule.title}</h4>
                  <span className="text-[10px] text-blue-400 font-semibold">{rule.taskType}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSchedule(rule.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    rule.isActive
                      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                  title={rule.isActive ? 'Active Rule - Click to Disable' : 'Inactive Rule - Click to Enable'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Frequency: <strong className="text-slate-200">{rule.frequency}</strong> ({rule.customTime || '09:00'})</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-slate-500" />
                  <span>Timezone: <strong className="text-slate-200">{rule.timezone}</strong></span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Next Run:</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {new Date(rule.nextRunAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={() => deleteSchedule(rule.id)}
                  className="text-[11px] font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete Rule
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              Configure Schedule Rule
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Rule Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Daily LinkedIn Morning Digest"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as ScheduleFrequency)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="One Time">One Time</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Custom">Custom Date</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Trigger Task</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as TaskType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Publish Preparation">Publish Preparation</option>
                  <option value="Generate Content">Generate Content</option>
                  <option value="Generate Image">Generate Image</option>
                  <option value="Cleanup">Cleanup</option>
                  <option value="Sync">Sync</option>
                </select>
              </div>
            </div>

            {frequency === 'Custom' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Custom Date</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Time (24h)</label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md shadow-blue-500/20"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
