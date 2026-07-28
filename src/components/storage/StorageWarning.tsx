import React from 'react';
import { StorageBreakdown } from '../../storage/types';
import { AlertTriangle, AlertCircle, Sparkles, HardDrive } from 'lucide-react';
import { Button } from '../ui/Button';

interface StorageWarningProps {
  breakdown: StorageBreakdown | null;
  onRunCleanup: () => void;
}

export const StorageWarning: React.FC<StorageWarningProps> = ({ breakdown, onRunCleanup }) => {
  if (!breakdown || (!breakdown.isWarning && !breakdown.isCritical)) {
    return null;
  }

  const { isCritical, usagePercentage, formatted } = breakdown;

  return (
    <div
      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn ${
        isCritical
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {isCritical ? (
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider">
            {isCritical ? 'Storage Quota Critical!' : 'Storage Capacity Warning'}
          </h4>
          <p className="text-xs opacity-90">
            Storage usage has reached <span className="font-bold">{usagePercentage}%</span> (
            {formatted.totalUsed} of {formatted.quota}). Run auto cleanup to prevent storage failure.
          </p>
        </div>
      </div>

      <Button
        variant={isCritical ? 'danger' : 'warning'}
        size="sm"
        onClick={onRunCleanup}
        leftIcon={<Sparkles className="h-3.5 w-3.5" />}
        className="shrink-0"
      >
        Run Quick Clean
      </Button>
    </div>
  );
};
