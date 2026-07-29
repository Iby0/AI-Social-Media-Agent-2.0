import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AlertOctagon, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ErrorStatus } from '../../types/analytics';

export const ErrorTable: React.FC = () => {
  const { errors, updateErrorStatus } = useAnalytics();

  if (errors.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900">Zero Active System Exceptions</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          All AI, publishing, and workflow engines are operating normally without unhandled errors.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">System Error & Warning Center</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">{errors.length} records</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Module</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Message</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {errors.map((err) => {
              let severityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
              if (err.severity === 'critical') severityBadge = 'bg-rose-100 text-rose-800 border-rose-300';
              if (err.severity === 'error') severityBadge = 'bg-rose-50 text-rose-700 border-rose-200';
              if (err.severity === 'warning') severityBadge = 'bg-amber-50 text-amber-700 border-amber-200';

              return (
                <tr key={err.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {new Date(err.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 uppercase font-bold text-slate-700 text-[10px]">
                    {err.module}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${severityBadge}`}>
                      {err.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium max-w-md break-words">
                    {err.message}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={err.status}
                      onChange={(e) => updateErrorStatus(err.id, e.target.value as ErrorStatus)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                        err.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : err.status === 'acknowledged'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <option value="unresolved">Unresolved</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
