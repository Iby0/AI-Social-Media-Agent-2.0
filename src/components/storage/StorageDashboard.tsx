import React, { useState, useEffect } from 'react';
import { StorageCard } from './StorageCard';
import { StorageProgress } from './StorageProgress';
import { StorageWarning } from './StorageWarning';
import { CleanupButton } from './CleanupButton';
import { CleanupReport } from './CleanupReport';
import { storageManager } from '../../storage/storage.manager';
import { StorageBreakdown, CleanupConfig, CleanupReport as CleanupReportType, DataPriorityItem } from '../../storage/types';
import { DEFAULT_CLEANUP_CONFIG } from '../../storage/constants';
import { settingService } from '../../database/services/settingService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import {
  HardDrive,
  Sparkles,
  Settings,
  ShieldCheck,
  RefreshCw,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const StorageDashboard: React.FC = () => {
  const [breakdown, setBreakdown] = useState<StorageBreakdown | null>(null);
  const [priorityItems, setPriorityItems] = useState<DataPriorityItem[]>([]);
  const [config, setConfig] = useState<CleanupConfig>(DEFAULT_CLEANUP_CONFIG);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastReport, setLastReport] = useState<CleanupReportType | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const { addToast } = useToast();

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const settings = await settingService.getSettings();
      const currentConfig: CleanupConfig = {
        ...DEFAULT_CLEANUP_CONFIG,
        autoCleanupEnabled: settings?.autoCleanup ?? DEFAULT_CLEANUP_CONFIG.autoCleanupEnabled,
        maxStorageLimitMB: settings?.storageLimit ?? DEFAULT_CLEANUP_CONFIG.maxStorageLimitMB,
      };
      setConfig(currentConfig);

      const metrics = await storageManager.getStorageMetrics(currentConfig);
      setBreakdown(metrics);

      const items = await storageManager.getDataPriorityBreakdown();
      setPriorityItems(items);
    } catch {
      addToast('Failed to load storage system metrics.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleRunCleanup = async (mode: 'manual' | 'auto' = 'manual') => {
    setIsCleaning(true);
    try {
      const report = await storageManager.runCleanup(mode, config);
      setLastReport(report);
      setShowReportModal(true);
      addToast(report.message, report.status === 'error' ? 'error' : 'success');
      await loadMetrics();
      return report;
    } catch {
      addToast('Error executing storage cleanup.', 'error');
      throw new Error('Cleanup failed');
    } finally {
      setIsCleaning(false);
    }
  };

  const handleSaveConfig = async (updated: Partial<CleanupConfig>) => {
    const newConfig = { ...config, ...updated };
    setConfig(newConfig);

    try {
      await settingService.saveSettings({
        autoCleanup: newConfig.autoCleanupEnabled,
        storageLimit: newConfig.maxStorageLimitMB,
      });
      addToast('Storage cleanup settings updated successfully.', 'success');
      await loadMetrics();
    } catch {
      addToast('Failed to save storage settings.', 'error');
    }
  };

  const scheduleInfo = storageManager.prepareCleanupSchedule(config.frequency);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HardDrive className="h-6 w-6" />
            </div>
            <span>Storage Manager & Auto Cleanup Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor local storage consumption, manage media quotas, and configure automatic cleanup rules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadMetrics}
            disabled={isLoading}
            leftIcon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh Metrics
          </Button>
          <CleanupButton onRunCleanup={handleRunCleanup} isCleaning={isCleaning} />
        </div>
      </div>

      {/* Warning Banner */}
      <StorageWarning breakdown={breakdown} onRunCleanup={() => handleRunCleanup('manual')} />

      {/* Main Storage Overview Card */}
      <StorageCard breakdown={breakdown} onRefresh={loadMetrics} />

      {/* Visual Capacity Bar */}
      <StorageProgress breakdown={breakdown} />

      {/* Cleanup Rules Configuration & Data Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rules & Settings */}
        <Card variant="default" className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader className="border-b border-slate-800/80 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="h-4 w-4 text-indigo-400" />
                Cleanup Rules & Policy Configuration
              </CardTitle>
              <Badge variant="purple">Module 09 Engine</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-5">
            {/* Toggle Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Auto Cleanup Engine</span>
                  <span className="text-[11px] text-slate-400">Run rule-based maintenance</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoCleanupEnabled}
                  onChange={(e) => handleSaveConfig({ autoCleanupEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Clean Temporary Files</span>
                  <span className="text-[11px] text-slate-400">Purge temporary preview assets</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.cleanTempFiles}
                  onChange={(e) => handleSaveConfig({ cleanTempFiles: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Remove Duplicates</span>
                  <span className="text-[11px] text-slate-400">Detect identical media assets</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.cleanDuplicates}
                  onChange={(e) => handleSaveConfig({ cleanDuplicates: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Purge Incomplete Uploads</span>
                  <span className="text-[11px] text-slate-400">Clean empty / failed drafts</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.cleanFailedUploads}
                  onChange={(e) => handleSaveConfig({ cleanFailedUploads: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Config Sliders & Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Max Storage Quota (MB)
                </label>
                <input
                  type="number"
                  value={config.maxStorageLimitMB}
                  onChange={(e) =>
                    handleSaveConfig({ maxStorageLimitMB: parseInt(e.target.value) || 500 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Log Retention (Days)
                </label>
                <input
                  type="number"
                  value={config.keepLogsDays}
                  onChange={(e) =>
                    handleSaveConfig({ keepLogsDays: parseInt(e.target.value) || 30 })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Cleanup Frequency
                </label>
                <select
                  value={config.frequency}
                  onChange={(e) =>
                    handleSaveConfig({ frequency: e.target.value as CleanupConfig['frequency'] })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="daily">Daily Cleanup</option>
                  <option value="weekly">Weekly Cleanup</option>
                  <option value="monthly">Monthly Cleanup</option>
                  <option value="never">Manual Only</option>
                </select>
              </div>
            </div>

            {/* Scheduled Preparation Info */}
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>
                  Next Scheduled Maintenance: <strong>{new Date(scheduleInfo.nextScheduledRun).toLocaleDateString()}</strong>
                </span>
              </div>
              <Badge variant="info">{config.frequency.toUpperCase()}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Data Priority System Inspector */}
        <Card variant="default" className="bg-slate-900 border-slate-800 flex flex-col justify-between">
          <CardHeader className="border-b border-slate-800/80 pb-3">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Data Priority System
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[360px]">
            <p className="text-[11px] text-slate-400">
              Low priority data is deleted first. Protected high priority items (active posts, channels) are never automatically purged.
            </p>

            <div className="space-y-2">
              {priorityItems.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-white block truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-500">{item.type.toUpperCase()}</span>
                  </div>

                  <Badge
                    variant={
                      item.priority === 'High'
                        ? 'success'
                        : item.priority === 'Medium'
                        ? 'purple'
                        : 'warning'
                    }
                    className="shrink-0 text-[10px]"
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cleanup Report Modal */}
      {showReportModal && (
        <CleanupReport report={lastReport} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};
