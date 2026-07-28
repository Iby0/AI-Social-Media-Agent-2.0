import React, { useState } from 'react';
import { History, CheckCircle, AlertTriangle, Info, AlertCircle, Filter } from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityLogsProps {
  logs: ActivityLog[];
}

export const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLogs = logs.filter((log) => selectedCategory === 'all' || log.category === selectedCategory);

  const getStatusIcon = (status: ActivityLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            System Activity & Operations Audit Log
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit trail recording AI post generations, channel token validations, and database backups.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs text-white outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="ai">AI Generations</option>
            <option value="post">Post Operations</option>
            <option value="channel">Channel Tokens</option>
            <option value="backup">Backups & Storage</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No activity logs recorded for this category yet.</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-800/40 transition-all flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{log.action}</span>
                    <span className="px-2 py-0.2 text-[10px] uppercase tracking-wider font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{log.details}</p>
                </div>
              </div>

              <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
