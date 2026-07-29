import React, { useState } from 'react';
import { WorkflowTask } from '../../types/workflow';
import { useTaskQueue } from '../../hooks/useTaskQueue';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface RetryDialogProps {
  task: WorkflowTask | null;
  onClose: () => void;
}

export const RetryDialog: React.FC<RetryDialogProps> = ({ task, onClose }) => {
  const { retryTask } = useTaskQueue();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const handleRetry = async () => {
    setIsSubmitting(true);
    await retryTask(task.id);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-400" />
          Retry Failed Task
        </h3>

        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Task ID: {task.id}</span>
          </div>
          <p className="font-mono text-[11px] text-red-300">
            Error: {task.error || 'Execution timeout or unexpected failure'}
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Task Type:</span>
            <span className="font-semibold text-white">{task.type}</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Retries Attempted:</span>
            <span className="font-semibold text-white">
              {task.retryCount} / {task.maxRetries}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Backoff Delay Applied:</span>
            <span className="font-mono text-amber-400 font-semibold">
              {(task.retryDelayMs / 1000).toFixed(1)}s
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
            Retry Immediately
          </button>
        </div>
      </div>
    </div>
  );
};
