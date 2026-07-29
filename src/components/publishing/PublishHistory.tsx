import React from 'react';
import { usePublishingContext } from '../../context/PublishingContext';
import { PLATFORM_INFO } from './PlatformSelector';
import { PublishStatusBadge } from './PublishStatus';
import { History, ExternalLink, Trash2, Clock, CheckCircle2 } from 'lucide-react';

export const PublishHistory: React.FC = () => {
  const { publishedItems, clearHistory } = usePublishingContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">Official API Publishing Audit History ({publishedItems.length})</h3>
        </div>
        {publishedItems.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History Logs</span>
          </button>
        )}
      </div>

      {publishedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Historical Records</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Dispatch posts from the queue to record official platform API response logs and platform URLs.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Platform & Post</th>
                  <th className="px-4 py-3">API Result</th>
                  <th className="px-4 py-3">Platform Post ID</th>
                  <th className="px-4 py-3">Published Time</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {publishedItems.map((record) => {
                  const platformInfo = PLATFORM_INFO[record.platform];
                  const PlatformIcon = platformInfo?.icon;

                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-all">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`p-1.5 rounded-lg ${platformInfo?.color || 'bg-slate-100'}`}>
                            {PlatformIcon && <PlatformIcon className="w-4 h-4" />}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{record.postTitle}</p>
                            <p className="text-[10px] text-slate-500 capitalize">{record.platform} API</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <PublishStatusBadge
                          status={record.result.success ? 'published' : 'failed'}
                          responseCode={record.result.responseCode}
                          errorMessage={record.result.errorMessage}
                          durationMs={record.result.durationMs}
                        />
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        {record.result.platformPostId || '—'}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {new Date(record.publishedTime).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {record.result.platformUrl ? (
                          <a
                            href={record.result.platformUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all"
                          >
                            <span>View Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
