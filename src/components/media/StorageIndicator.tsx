import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HardDrive, AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { StorageInfo } from '../../database/types';

interface StorageIndicatorProps {
  storageInfo: StorageInfo | null;
  totalMediaCount: number;
  onRefresh?: () => void;
}

export const StorageIndicator: React.FC<StorageIndicatorProps> = ({
  storageInfo,
  totalMediaCount,
  onRefresh,
}) => {
  if (!storageInfo) {
    return (
      <Card variant="default" className="bg-slate-900/60 border-slate-800">
        <CardContent className="p-4 flex items-center justify-between text-xs text-slate-400">
          <span>Loading storage status...</span>
        </CardContent>
      </Card>
    );
  }

  const { usedFormatted, quotaFormatted, usagePercentage, isWarning, isLimitExceeded } = storageInfo;

  return (
    <Card variant="default" className="bg-slate-900 border-slate-800">
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HardDrive className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">IndexedDB Media Storage</span>
                <Badge variant={isWarning ? 'warning' : 'success'}>
                  {isLimitExceeded ? 'Storage Full' : isWarning ? 'Storage Warning' : 'Healthy'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Local offline storage quota allocation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <span className="text-xs font-bold text-white block">{usedFormatted} / {quotaFormatted}</span>
              <span className="text-[10px] text-slate-400">{totalMediaCount} Media Assets</span>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                title="Refresh Storage Status"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isLimitExceeded
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.max(2, usagePercentage)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>Used: {usagePercentage}%</span>
            <span>Capacity Limit: {quotaFormatted}</span>
          </div>
        </div>

        {/* Warning Banner */}
        {isWarning && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mt-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Storage Usage High ({usagePercentage}%)</span>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                You are approaching your local storage limit. Consider deleting unused post media assets to free up space.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
