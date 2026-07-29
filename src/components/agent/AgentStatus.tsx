import React from 'react';
import { useAgent } from '../../hooks/useAgent';
import { AgentState } from '../../types/agent';
import { Bot, Play, Pause, AlertCircle, CheckCircle2, Clock, Sparkles, Loader2, Zap } from 'lucide-react';

export const STATE_CONFIG: Record<
  AgentState,
  { label: string; bg: string; text: string; border: string; icon: React.FC<any> }
> = {
  idle: { label: 'Autonomous Idle', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Bot },
  checking: { label: 'Checking Rules', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  generating: { label: 'Generating AI Post', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: Sparkles },
  waiting: { label: 'Waiting Queue', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: Clock },
  queued: { label: 'Queued for Dispatch', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Zap },
  publishing_ready: { label: 'Publishing Ready', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle2 },
  completed: { label: 'Task Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  failed: { label: 'Execution Failed', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: AlertCircle },
  paused: { label: 'Agent Paused', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', icon: Pause },
};

export const AgentStatus: React.FC = () => {
  const { agentState, currentTask, isProcessing } = useAgent();
  const config = STATE_CONFIG[agentState] || STATE_CONFIG.idle;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${config.bg} ${config.text} ${config.border} border`}>
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Agent Execution State</h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-0.5 border ${config.bg} ${config.text} ${config.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`} />
              {config.label}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Mode</p>
          <p className="text-xs font-bold text-indigo-600">Zero-Server Client Orchestration</p>
        </div>
      </div>

      {/* Active Task Progress Bar */}
      {currentTask && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 truncate">{currentTask.title}</span>
            <span className="font-mono text-indigo-600 font-bold">{currentTask.progressPercentage}%</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${currentTask.progressPercentage}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500">
            Target Platform: <span className="font-semibold uppercase text-slate-700">{currentTask.targetPlatform}</span>
          </p>
        </div>
      )}
    </div>
  );
};
