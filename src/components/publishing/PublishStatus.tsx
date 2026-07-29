import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Loader2, RefreshCw } from 'lucide-react';

interface PublishStatusProps {
  status: 'pending' | 'publishing' | 'published' | 'failed' | 'retry';
  responseCode?: number;
  errorMessage?: string;
  durationMs?: number;
}

export const PublishStatusBadge: React.FC<PublishStatusProps> = ({
  status,
  responseCode,
  errorMessage,
  durationMs,
}) => {
  switch (status) {
    case 'published':
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Published API 200 OK</span>
            {durationMs && <span className="text-[10px] text-emerald-600">({durationMs}ms)</span>}
          </span>
        </div>
      );
    case 'publishing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          <span>Dispatching API Call...</span>
        </span>
      );
    case 'failed':
      return (
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Publish Failed {responseCode ? `(${responseCode})` : ''}</span>
          </span>
          {errorMessage && (
            <p className="text-[11px] text-rose-600 bg-rose-50/50 p-1.5 rounded border border-rose-100 max-w-xs font-mono truncate">
              {errorMessage}
            </p>
          )}
        </div>
      );
    case 'retry':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>Scheduled for Retry</span>
        </span>
      );
    case 'pending':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Queued for Dispatch</span>
        </span>
      );
  }
};
