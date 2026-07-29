import React, { useState } from 'react';
import { BackupProvider } from '../../context/BackupContext';
import { BackupStatus } from './BackupStatus';
import { BackupHistory } from './BackupHistory';
import { BackupWizard } from './BackupWizard';
import { RestoreWizard } from './RestoreWizard';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';
import { useBackup } from '../../hooks/useBackup';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  History,
  Settings,
  PlusCircle,
  HardDrive,
  Info,
} from 'lucide-react';
import { BackupMetadata } from '../../types/backup';

const InnerBackupDashboard: React.FC = () => {
  const { settings, updateSettings, lastActionSummary } = useBackup();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'create' | 'restore' | 'history' | 'settings'
  >('overview');

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedHistoryRestore, setSelectedHistoryRestore] = useState<BackupMetadata | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Database className="w-3 h-3" /> Offline Backup & Restore Engine
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> IndexedDB Local Architecture
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Backup, Restore & Import / Export Center
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Protect and restore your social posts, API settings, workflows, and analytics with full-fidelity local backups and version verification.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import File</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {lastActionSummary && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2 font-medium">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{lastActionSummary}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'create'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create Backup</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('restore')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'restore'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restore Engine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Archive History</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Auto-Backup Settings</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <BackupStatus />
          <BackupHistory
            onSelectBackupForRestore={(meta) => {
              setSelectedHistoryRestore(meta);
              setActiveTab('restore');
            }}
          />
        </div>
      )}

      {activeTab === 'create' && <BackupWizard onSuccess={() => setActiveTab('history')} />}

      {activeTab === 'restore' && (
        <RestoreWizard selectedHistoryMeta={selectedHistoryRestore} onSuccess={() => setActiveTab('overview')} />
      )}

      {activeTab === 'history' && (
        <BackupHistory
          onSelectBackupForRestore={(meta) => {
            setSelectedHistoryRestore(meta);
            setActiveTab('restore');
          }}
        />
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 max-w-2xl">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Auto-Backup & Safety Rules Configuration</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Auto Backup Switch */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="font-bold text-slate-800">Enable Automated Local Backups</p>
                <p className="text-[11px] text-slate-400">Periodic snapshot creation stored directly in IndexedDB</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoBackupEnabled}
                onChange={(e) => updateSettings({ autoBackupEnabled: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>

            {/* Frequency */}
            {settings.autoBackupEnabled && (
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Backup Frequency Schedule</label>
                <select
                  value={settings.frequency}
                  onChange={(e) => updateSettings({ frequency: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="daily">Daily Snapshot</option>
                  <option value="weekly">Weekly Snapshot</option>
                  <option value="monthly">Monthly Snapshot</option>
                </select>
              </div>
            )}

            {/* Safety Backup before restore */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <p className="font-bold text-slate-800">Safety Snapshot Before Restore</p>
                <p className="text-[11px] text-slate-400">Automatically creates a rollback point before overwriting data</p>
              </div>
              <input
                type="checkbox"
                checked={settings.backupBeforeRestore}
                onChange={(e) => updateSettings({ backupBeforeRestore: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </div>

            {/* Max backups */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-bold text-slate-700">Maximum Backups Retained</label>
                <span className="font-mono text-indigo-600 font-bold">{settings.maxStoredBackups}</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={settings.maxStoredBackups}
                onChange={(e) => updateSettings({ maxStoredBackups: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Import / Export Modals */}
      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onPayloadImported={() => setActiveTab('restore')}
      />

      <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};

export const BackupDashboard: React.FC = () => {
  return (
    <BackupProvider>
      <InnerBackupDashboard />
    </BackupProvider>
  );
};
