import React, { useState } from 'react';
import { useTaskQueue } from '../../hooks/useTaskQueue';
import { TaskPriority, TaskStatus, TaskType } from '../../types/workflow';
import {
  ListTodo,
  Play,
  RotateCcw,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
  Zap,
} from 'lucide-react';

const PRIORITY_BADGES: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-800' },
  High: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-800' },
  Normal: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-800' },
  Low: { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
};

const STATUS_ICONS: Record<TaskStatus, any> = {
  pending: Clock,
  running: Zap,
  completed: CheckCircle,
  failed: XCircle,
  retrying: RotateCcw,
  cancelled: Trash2,
};

export const TaskQueue = () => {
  const {
    tasks,
    enqueueTask,
    retryTask,
    cancelTask,
    clearCompletedTasks,
    processQueueNow,
    isProcessing,
  } = useTaskQueue();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isEnqueueModalOpen, setIsEnqueueModalOpen] = useState(false);

  // Custom Enqueue Form State
  const [newType, setNewType] = useState<TaskType>('Generate Content');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Normal');
  const [newPostTitle, setNewPostTitle] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const handleCustomEnqueue = async (e: React.FormEvent) => {
    e.preventDefault();
    await enqueueTask(newType, newPriority, { postTitle: newPostTitle || 'Custom Queue Task' });
    setIsEnqueueModalOpen(false);
    setNewPostTitle('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-blue-400" />
            Asynchronous Task Execution Queue
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Priority worker engine processing enqueued workflow tasks with automatic retries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={processQueueNow}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
          >
            <Play className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Processing Worker...' : 'Execute Next Task'}
          </button>

          <button
            type="button"
            onClick={() => setIsEnqueueModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Enqueue Task
          </button>

          <button
            type="button"
            onClick={clearCompletedTasks}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Finished
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-400">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full"
          >
            <option value="all" className="bg-slate-900">All Statuses</option>
            <option value="pending" className="bg-slate-900">Pending</option>
            <option value="running" className="bg-slate-900">Running</option>
            <option value="completed" className="bg-slate-900">Completed</option>
            <option value="failed" className="bg-slate-900">Failed</option>
            <option value="retrying" className="bg-slate-900">Retrying</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-400">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full"
          >
            <option value="all" className="bg-slate-900">All Priorities</option>
            <option value="Critical" className="bg-slate-900">Critical</option>
            <option value="High" className="bg-slate-900">High</option>
            <option value="Normal" className="bg-slate-900">Normal</option>
            <option value="Low" className="bg-slate-900">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Task ID & Type</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Created / Scheduled</th>
              <th className="py-3 px-3">Retries</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No matching tasks found in queue.
                </td>
              </tr>
            ) : (
              filteredTasks.map((t) => {
                const StatusIcon = STATUS_ICONS[t.status] || Clock;
                const pStyle = PRIORITY_BADGES[t.priority] || PRIORITY_BADGES.Normal;

                return (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* ID & Type */}
                    <td className="py-3.5 px-3 space-y-0.5">
                      <div className="font-bold text-slate-200 flex items-center gap-2">
                        <span>{t.type}</span>
                        {t.payload?.postTitle && (
                          <span className="text-[11px] text-slate-400 font-normal truncate max-w-[180px]">
                            ({t.payload.postTitle})
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{t.id}</div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${pStyle.border} ${pStyle.bg} ${pStyle.text}`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-300 capitalize">
                        <StatusIcon
                          className={`w-3.5 h-3.5 ${
                            t.status === 'running'
                              ? 'text-amber-400 animate-spin'
                              : t.status === 'completed'
                              ? 'text-emerald-400'
                              : t.status === 'failed'
                              ? 'text-red-400'
                              : 'text-blue-400'
                          }`}
                        />
                        <span>{t.status}</span>
                      </div>
                      {t.error && <p className="text-[10px] text-red-400 line-clamp-1 mt-0.5">{t.error}</p>}
                    </td>

                    {/* Scheduled */}
                    <td className="py-3.5 px-3 text-slate-400 text-[11px] space-y-0.5">
                      <div>Created: {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-slate-500 text-[10px]">
                        Run: {new Date(t.scheduledAt || t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Retries */}
                    <td className="py-3.5 px-3 text-slate-300 text-xs">
                      {t.retryCount} / {t.maxRetries}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status === 'failed' && (
                          <button
                            type="button"
                            onClick={() => retryTask(t.id)}
                            className="p-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 transition-colors"
                            title="Retry Task Now"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {(t.status === 'pending' || t.status === 'retrying') && (
                          <button
                            type="button"
                            onClick={() => cancelTask(t.id)}
                            className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 transition-colors"
                            title="Cancel Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Enqueue Modal */}
      {isEnqueueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCustomEnqueue}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              Enqueue New Workflow Task
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Task Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as TaskType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Generate Content">Generate Content</option>
                <option value="Generate Image">Generate Image</option>
                <option value="Save Draft">Save Draft</option>
                <option value="Schedule Post">Schedule Post</option>
                <option value="Publish Preparation">Publish Preparation</option>
                <option value="Health Check">Health Check</option>
                <option value="Cleanup">Cleanup</option>
                <option value="Sync">Sync</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Priority Level</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Payload Reference Title</label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="e.g. Weekly Tech Roundup"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsEnqueueModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-md shadow-blue-500/20"
              >
                Submit to Queue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
