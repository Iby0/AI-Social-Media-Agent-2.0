import React, { useState } from 'react';
import {
  Download,
  Upload,
  Cloud,
  Check,
  HardDrive
} from 'lucide-react';
import { BackupSettings } from '../types';
import { db } from '../lib/db';
import { SettingsLayout } from './settings/SettingsLayout';

interface SettingsViewProps {
  settings?: BackupSettings | null;
  onSaveSettings?: (settings: BackupSettings) => void;
  onLogActivity?: (action: string, category: 'backup', details: string, status?: 'success' | 'warning' | 'info' | 'error') => void;
  onReloadData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onLogActivity,
  onReloadData,
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(settings?.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings?.supabaseAnonKey || '');
  const [useSupabase, setUseSupabase] = useState(settings?.useSupabaseBackup || false);
  const [autoSync, setAutoSync] = useState(settings?.autoSync || false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleExportJSON = async () => {
    try {
      const jsonStr = await db.exportDatabaseJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_social_agent_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onLogActivity?.('IndexedDB Exported', 'backup', 'Downloaded full database JSON snapshot.', 'success');
      setStatusMsg('Full database backup exported!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target?.result as string;
        await db.importDatabaseJSON(content);
        onReloadData?.();
        setStatusMsg('Database restored and reloaded!');
        setTimeout(() => setStatusMsg(null), 3000);
      } catch (err: any) {
        alert('Invalid JSON backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveBackupConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BackupSettings = {
      useSupabaseBackup: useSupabase,
      supabaseUrl,
      supabaseAnonKey,
      autoSync,
      lastBackupAt: new Date().toISOString(),
    };
    onSaveSettings?.(updated);
    onLogActivity?.('Backup Config Saved', 'backup', 'Saved Supabase cloud backup credentials.', 'info');
    setStatusMsg('Supabase backup configuration saved!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Module 10 User Settings & Preference Management Layout */}
      <SettingsLayout />

      {/* Auxiliary Cloud Backup & Raw Database Snapshot Tools */}
      <div className="border-t border-slate-800/80 pt-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cloud className="h-5 w-5 text-indigo-400" />
              Raw Database Backup & Cloud Sync (Optional)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Export complete IndexedDB table snapshots or connect Supabase PostgreSQL for remote backup.
            </p>
          </div>

          {statusMsg && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
              <Check className="h-4 w-4" /> {statusMsg}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary Storage: Full Database JSON Export/Import */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <HardDrive className="h-5 w-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Full Database JSON Snapshot</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Export or import your entire IndexedDB instance (posts, media library, schedules, accounts, logs, settings).
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportJSON}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <Download className="h-4 w-4" /> Export Full DB
              </button>

              <label className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all">
                <Upload className="h-4 w-4 text-indigo-400" /> Restore DB
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
          </div>

          {/* Optional Backup: Supabase Cloud Sync */}
          <form onSubmit={handleSaveBackupConfig} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Supabase Remote Sync</h4>
              </div>

              <input
                type="checkbox"
                checked={useSupabase}
                onChange={(e) => setUseSupabase(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Project URL</label>
              <input
                type="text"
                disabled={!useSupabase}
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Anon API Key</label>
              <input
                type="password"
                disabled={!useSupabase}
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all border border-slate-700"
            >
              Save Remote Config
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

