import React from 'react';
import { useAgent } from '../../hooks/useAgent';
import { CheckCircle2, AlertCircle, Clock, Sparkles, ExternalLink, Bot } from 'lucide-react';
import { STATE_CONFIG } from './AgentStatus';

export const TaskTimeline: React.FC = () => {
  const { currentTask, tasksHistory } = useAgent();

  const allTasks = currentTask ? [currentTask, ...tasksHistory.filter((t) => t.id !== currentTask.id)] : tasksHistory;

  if (allTasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Bot className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Task History</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Trigger the Autonomous AI Agent to execute decision checks, generate posts, and dispatch publishing tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Task Execution Timeline</h3>
        <span className="text-xs text-slate-500 font-mono">{allTasks.length} tasks logged</span>
      </div>

      <div className="space-y-3">
        {allTasks.map((task) => {
          const statusConfig = STATE_CONFIG[task.state] || STATE_CONFIG.completed;

          return (
            <div
              key={task.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                    {task.state}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  {task.completedAt ? new Date(task.completedAt).toLocaleTimeString() : 'In Progress...'}
                </span>
              </div>

              {task.generatedContent && (
                <p className="text-xs text-slate-600 line-clamp-2 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                  "{task.generatedContent}"
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>
                  Topic: <strong className="text-slate-700">{task.topic}</strong>
                </span>
                <span className="uppercase font-bold text-indigo-600">{task.targetPlatform}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
