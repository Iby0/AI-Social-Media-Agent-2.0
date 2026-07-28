import React from 'react';
import { StorageBreakdown } from '../../storage/types';
import { HardDrive, AlertTriangle } from 'lucide-react';

interface StorageProgressProps {
  breakdown: StorageBreakdown | null;
}

export const StorageProgress: React.FC<StorageProgressProps> = ({ breakdown }) => {
  if (!breakdown) return null;

  const {
    totalUsedBytes,
    quotaBytes,
    mediaSizeBytes,
    databaseSizeBytes,
    cacheSizeBytes,
    tempSizeBytes,
    usagePercentage,
    isWarning,
    isCritical,
    formatted,
  } = breakdown;

  // Calculate percentage share relative to total quota
  const mediaPct = Math.min(100, (mediaSizeBytes / quotaBytes) * 100);
  const dbPct = Math.min(100, (databaseSizeBytes / quotaBytes) * 100);
  const cachePct = Math.min(100, (cacheSizeBytes / quotaBytes) * 100);
  const tempPct = Math.min(100, (tempSizeBytes / quotaBytes) * 100);

  return (
    <div className="space-y-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-indigo-400" />
          Storage Capacity Bar ({usagePercentage}%)
        </span>
        <span className="text-slate-400 font-semibold">
          {formatted.totalUsed} used of {formatted.quota}
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex p-0.5 border border-slate-800">
        <div
          title={`Media Assets: ${formatted.mediaSize}`}
          className="h-full bg-indigo-500 rounded-l-full transition-all duration-500"
          style={{ width: `${mediaPct}%` }}
        />
        <div
          title={`Database Data: ${formatted.databaseSize}`}
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${dbPct}%` }}
        />
        <div
          title={`Cache & Storage: ${formatted.cacheSize}`}
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${cachePct}%` }}
        />
        <div
          title={`Temporary Files: ${formatted.tempSize}`}
          className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
          style={{ width: `${tempPct}%` }}
        />
      </div>

      {/* Segment Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
          <span>Media ({mediaPct.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span>Database ({dbPct.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span>Cache ({cachePct.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <span>Temp ({tempPct.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
};
