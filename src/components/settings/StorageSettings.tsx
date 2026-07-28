import React, { useEffect, useState } from 'react';
import { HardDrive, AlertTriangle, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { useSettingsContext } from '../../providers/SettingsContext';
import { storageMonitor } from '../../storage/storage.monitor';
import { StorageInfo } from '../../database/types';

export const StorageSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsContext();
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);

  useEffect(() => {
    storageMonitor.getStorageBreakdown({ maxStorageLimitMB: settings.storageLimit }).then((breakdown) => {
      setStorageInfo({
        usedBytes: breakdown.totalUsedBytes,
        quotaBytes: breakdown.quotaBytes,
        usagePercentage: breakdown.usagePercentage,
        isWarning: breakdown.isWarning,
        isLimitExceeded: breakdown.isCritical,
        usedFormatted: breakdown.formatted.totalUsed,
        quotaFormatted: breakdown.formatted.quota,
      });
    }).catch(console.error);
  }, [settings.storageLimit]);

  const handleLimitChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit)) {
      await updateSettings({ storageLimit: newLimit });
    }
  };

  const limitPresets = [100, 250, 500, 1000, 2000, 5000];

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-cyan-400" />
            Storage Quota & Limit Settings
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Integrated with Module 09 Storage Manager to limit IndexedDB media disk usage.
          </p>
        </div>
      </div>

      {/* Storage Status Overview */}
      {storageInfo && (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Database className="h-4 w-4 text-cyan-400" /> Current IndexedDB Storage Usage
            </span>
            <span className="text-white font-mono">{storageInfo.usedFormatted} / {settings.storageLimit} MB</span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                storageInfo.isLimitExceeded
                  ? 'bg-rose-500'
                  : storageInfo.isWarning
                  ? 'bg-amber-500'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(100, storageInfo.usagePercentage)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Warning Trigger: 80% ({Math.round(settings.storageLimit * 0.8)} MB)</span>
            <span className="flex items-center gap-1 text-cyan-300 font-medium">
              {storageInfo.usagePercentage}% Used
            </span>
          </div>
        </div>
      )}

      {/* Storage Limit Input and Slider */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-300">Max Allowed Storage Limit (MB)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="50"
              max="10000"
              value={settings.storageLimit}
              onChange={handleLimitChange}
              className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-cyan-500"
            />
            <span className="text-xs text-slate-400 font-semibold">MB</span>
          </div>
        </div>

        <input
          type="range"
          min="100"
          max="5000"
          step="50"
          value={settings.storageLimit}
          onChange={handleLimitChange}
          className="w-full accent-cyan-500 cursor-pointer"
        />

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs text-slate-500 self-center mr-1">Presets:</span>
          {limitPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => updateSettings({ storageLimit: preset })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                settings.storageLimit === preset
                  ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {preset} MB
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
