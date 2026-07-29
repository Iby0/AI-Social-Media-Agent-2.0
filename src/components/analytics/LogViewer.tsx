import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Terminal, Filter, Trash2, Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { SystemModuleType } from '../../types/analytics';

export const LogViewer: React.FC = () => {
  const { logs, activeModuleFilter, setActiveModuleFilter, clearAllAnalyticsData } = useAnalytics();

  const moduleCategories: { key: SystemModuleType | 'all'; label: string }[] = [
    { key: 'all', label: 'All Logs' },
    { key: 'workflow', label: 'Workflow' },
    { key: 'publishing', label: 'Publishing' },
    { key: 'ai', label: 'AI Engine' },
    { key: 'automation', label: 'Automation' },
    { key: 'storage', label: 'Storage' },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">Live System Log Viewer</h3>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {moduleCategories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveModuleFilter(cat.key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeModuleFilter === cat.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <button
            type="button"
            onClick={clearAllAnalyticsData}
            className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all ml-2"
            title="Clear all logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-2 text-xs font-mono">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No system log records found for selected filter.
          </div>
        ) : (
          logs.map((log) => {
            let badge = 'text-blue-400 bg-blue-950/60 border-blue-800/50';
            let Icon = Info;

            if (log.level === 'warn') {
              badge = 'text-amber-400 bg-amber-950/60 border-amber-800/50';
              Icon = AlertTriangle;
            } else if (log.level === 'error') {
              badge = 'text-rose-400 bg-rose-950/60 border-rose-800/50';
              Icon = AlertCircle;
            }

            return (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5"
              >
                <span className={`p-1 rounded border ${badge} shrink-0 mt-0.5`}>
                  <Icon className="w-3 h-3" />
                </span>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="uppercase font-bold tracking-wider text-indigo-400">
                      [{log.module}]
                    </span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs break-words">{log.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
