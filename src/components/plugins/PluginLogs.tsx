import React, { useState } from 'react';
import { usePluginManager } from '../../hooks/usePluginManager';
import {
  History,
  Trash2,
  AlertCircle,
  CheckCircle,
  Power,
  RotateCw,
  Info,
  Filter,
} from 'lucide-react';

export const PluginLogs: React.FC = () => {
  const { logs, clearLogs } = usePluginManager();
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    if (actionFilter === 'all') return true;
    return log.action === actionFilter;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'enable':
        return <Power className="w-3.5 h-3.5 text-emerald-500" />;
      case 'disable':
        return <Power className="w-3.5 h-3.5 text-slate-400" />;
      case 'install':
        return <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      case 'reload':
      case 'update':
        return <RotateCw className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Plugin Execution & Lifecycle Logs</h3>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {filteredLogs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl text-xs">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none text-xs"
            >
              <option value="all">All Actions</option>
              <option value="install">Install</option>
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
              <option value="update">Update</option>
              <option value="reload">Reload</option>
              <option value="error">Errors</option>
            </select>
          </div>

          {logs.length > 0 && (
            <button
              type="button"
              onClick={clearLogs}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Audit</span>
            </button>
          )}
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-10 text-xs text-slate-400">
          No audit log events recorded yet for this filter.
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start gap-3 hover:bg-slate-100/80 transition-all"
            >
              <div className="p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                {getActionIcon(log.action)}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 truncate">{log.pluginName}</span>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
