import React, { useState } from 'react';
import { Trash2, RefreshCw, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useSettingsContext } from '../../providers/SettingsContext';
import { CleanupFrequencyOption } from '../../database/types';
import { cleanupService } from '../../storage/cleanup/cleanup.service';

export const CleanupSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsContext();
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [cleanupResult, setCleanupResult] = useState<string | null>(null);

  const handleAutoCleanupToggle = async () => {
    await updateSettings({ autoCleanup: !settings.autoCleanup });
  };

  const handleFrequencyChange = async (freq: CleanupFrequencyOption) => {
    await updateSettings({ cleanupFrequency: freq });
  };

  const handleManualCleanup = async () => {
    try {
      setIsCleaning(true);
      setCleanupResult(null);
      const report = await cleanupService.executeCleanup('manual');
      setCleanupResult(
        report.totalItemsRemoved > 0
          ? `Successfully freed ${report.formattedBytesFreed} by purging ${report.totalItemsRemoved} expired items.`
          : 'Storage is clean! No expired temporary files or old logs were found.'
      );
    } catch (err: any) {
      setCleanupResult('Failed to perform manual cleanup.');
    } finally {
      setIsCleaning(false);
    }
  };

  const frequencies: { id: CleanupFrequencyOption; label: string; desc: string }[] = [
    { id: 'daily', label: 'Daily', desc: 'Purge temp files every 24 hours' },
    { id: 'weekly', label: 'Weekly', desc: 'Purge temp files every 7 days' },
    { id: 'monthly', label: 'Monthly', desc: 'Purge temp files every 30 days' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-rose-400" />
            Auto Cleanup & Maintenance
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Automatically delete orphaned temporary media uploads to optimize IndexedDB storage.
          </p>
        </div>

        {/* Master Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-semibold text-slate-300">
            {settings.autoCleanup ? 'Auto Cleanup On' : 'Auto Cleanup Off'}
          </span>
          <div
            onClick={handleAutoCleanupToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              settings.autoCleanup ? 'bg-rose-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                settings.autoCleanup ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>

      {/* Frequency Selection */}
      <div className={`space-y-3 transition-opacity duration-200 ${settings.autoCleanup ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <label className="text-xs font-semibold text-slate-300 block">Cleanup Schedule Frequency</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {frequencies.map((f) => {
            const isSelected = settings.cleanupFrequency === f.id;

            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFrequencyChange(f.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500/10 border-rose-500 ring-1 ring-rose-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{f.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-rose-400" />}
                </div>
                <p className="text-[11px] text-slate-400">{f.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Trigger */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" /> Manual Instant Cleanup
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Immediately trigger temporary file cleanup without waiting for the scheduled frequency.
          </p>
        </div>

        <button
          onClick={handleManualCleanup}
          disabled={isCleaning}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isCleaning ? 'animate-spin text-rose-400' : 'text-slate-400'}`} />
          {isCleaning ? 'Cleaning...' : 'Run Storage Cleanup Now'}
        </button>
      </div>

      {cleanupResult && (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          {cleanupResult}
        </div>
      )}
    </div>
  );
};
