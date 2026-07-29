import React from 'react';
import { useBackup } from '../../hooks/useBackup';
import { Database, ShieldCheck, Clock, HardDrive, AlertCircle } from 'lucide-react';

export const BackupStatus: React.FC = () => {
  const { history, settings } = useBackup();

  const lastBackup = history.length > 0 ? history[0] : null;
  const totalSizeBytes = history.reduce((acc, curr) => acc + curr.sizeBytes, 0);
  const totalMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Last Backup Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Last Local Backup</span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg font-black text-slate-900 tracking-tight">
            {lastBackup ? new Date(lastBackup.timestamp).toLocaleDateString() : 'Never'}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            {lastBackup ? `${lastBackup.name} (${lastBackup.backupType})` : 'No backups recorded yet'}
          </p>
        </div>
      </div>

      {/* Auto Backup Frequency */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Auto-Backup Frequency</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg font-black text-slate-900 tracking-tight capitalize">
            {settings.autoBackupEnabled ? settings.frequency : 'Disabled'}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            {settings.backupBeforeRestore ? 'Safety snapshot active before restore' : 'Manual only'}
          </p>
        </div>
      </div>

      {/* Backup History Count */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Total Backups Stored</span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg font-black text-slate-900 tracking-tight">{history.length} Backups</p>
          <p className="text-[10px] text-slate-400 font-medium">Local IndexedDB & localStorage</p>
        </div>
      </div>

      {/* Local Storage Volume */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Archive Size</span>
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
            <HardDrive className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg font-black text-slate-900 tracking-tight">{totalMB} MB</p>
          <p className="text-[10px] text-slate-400 font-medium">100% On-Device Storage</p>
        </div>
      </div>
    </div>
  );
};
