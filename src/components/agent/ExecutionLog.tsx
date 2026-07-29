import React from 'react';
import { useAgent } from '../../hooks/useAgent';
import { Terminal, Trash2, Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export const ExecutionLog: React.FC = () => {
  const { logs, clearLogs } = useAgent();

  if (logs.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl p-6 text-center text-slate-400 text-xs border border-slate-800 space-y-2">
        <Terminal className="w-6 h-6 mx-auto text-slate-600" />
        <p className="font-mono">Execution log empty. Trigger autonomous agent cycle to populate live events.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3 font-mono shadow-lg">
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-200">Autonomous Agent Terminal Log</span>
        </div>
        <button
          type="button"
          onClick={clearLogs}
          className="inline-flex items-center gap-1 text-[11px] hover:text-slate-200 transition-all"
        >
          <Trash2 className="w-3 h-3 text-slate-500" /> Clear
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-2 text-xs">
        {logs.map((log) => {
          let badgeColor = 'text-blue-400 bg-blue-950/60 border-blue-800/50';
          let Icon = Info;

          if (log.level === 'warn') {
            badgeColor = 'text-amber-400 bg-amber-950/60 border-amber-800/50';
            Icon = AlertTriangle;
          } else if (log.level === 'error') {
            badgeColor = 'text-rose-400 bg-rose-950/60 border-rose-800/50';
            Icon = AlertCircle;
          } else if (log.level === 'success') {
            badgeColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50';
            Icon = CheckCircle2;
          }

          return (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5"
            >
              <span className={`p-1 rounded border ${badgeColor} shrink-0 mt-0.5`}>
                <Icon className="w-3 h-3" />
              </span>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="uppercase font-bold tracking-wider">{log.level}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs break-words">{log.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
