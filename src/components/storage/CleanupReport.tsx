import React from 'react';
import { CleanupReport as CleanupReportType } from '../../storage/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle2, AlertTriangle, X, HardDrive, Sparkles, Trash2, ShieldCheck } from 'lucide-react';

interface CleanupReportProps {
  report: CleanupReportType | null;
  onClose: () => void;
}

export const CleanupReport: React.FC<CleanupReportProps> = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Storage Cleanup Summary Report</h3>
              <p className="text-xs text-slate-400">
                Executed at {new Date(report.executedAt).toLocaleString()} ({report.mode} mode)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  Freed {report.formattedBytesFreed}
                </h4>
                <p className="text-xs text-emerald-300/80">
                  Successfully removed {report.totalItemsRemoved} redundant or obsolete storage items.
                </p>
              </div>
            </div>
            <Badge variant="success" className="px-3 py-1">
              {report.status.toUpperCase()}
            </Badge>
          </div>

          {/* Rule Execution List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Rule Execution Details
            </h4>

            <div className="space-y-2">
              {report.ruleResults.map((res, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{res.ruleName}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{res.details}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-emerald-400 block">
                      +{res.bytesFreed > 0 ? (res.bytesFreed / (1024 * 1024)).toFixed(2) + ' MB' : '0 B'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {res.itemsRemoved} items
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-indigo-400" />
            Storage saved to IndexedDB Log Store
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done & Close
          </Button>
        </div>
      </div>
    </div>
  );
};
