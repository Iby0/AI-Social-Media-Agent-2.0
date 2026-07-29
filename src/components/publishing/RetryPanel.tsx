import React from 'react';
import { PublishRequest } from '../../publishers/publisher.types';
import { usePublishingContext } from '../../context/PublishingContext';
import { RefreshCw, XCircle, AlertTriangle, Play } from 'lucide-react';
import { PLATFORM_INFO } from './PlatformSelector';

export const RetryPanel: React.FC = () => {
  const { retryQueue, failedQueue, retryFailed, cancelRequest, isPublishing } = usePublishingContext();

  const allProblematic = [...retryQueue, ...failedQueue];

  if (allProblematic.length === 0) {
    return (
      <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <RefreshCw className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-emerald-900">Retry Queue Clear</h4>
        <p className="text-xs text-emerald-700 mt-1">
          No dispatch failures or rate-limit retries currently backlogged. All API calls healthy!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Failed & Retry Backlog ({allProblematic.length})</h3>
        </div>
        <span className="text-xs text-slate-500">Exponential Backoff Active</span>
      </div>

      <div className="space-y-3">
        {allProblematic.map((item) => {
          const platformInfo = PLATFORM_INFO[item.platform];
          const PlatformIcon = platformInfo?.icon;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-rose-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`p-1 rounded ${platformInfo?.color || 'bg-slate-100'}`}>
                    {PlatformIcon && <PlatformIcon className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{item.postTitle}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    Attempt {item.retryCount} / {item.maxRetries || 3}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{item.caption}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => retryFailed(item.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Manual Retry</span>
                </button>

                <button
                  type="button"
                  onClick={() => cancelRequest(item.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Discard</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
