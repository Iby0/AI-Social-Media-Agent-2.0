import React from 'react';
import { useBackup } from '../../hooks/useBackup';
import { Database, Download, CheckCircle2, AlertOctagon, Trash2, FileCode } from 'lucide-react';
import { BackupMetadata } from '../../types/backup';

export const BackupHistory: React.FC<{
  onSelectBackupForRestore?: (meta: BackupMetadata) => void;
}> = ({ onSelectBackupForRestore }) => {
  const { history, clearHistory, exportBackupJson } = useBackup();

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Database className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900">No Backup History Found</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Create your first manual backup or enable automatic backups in the settings tab.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Stored Backup Archive History</h3>
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
              <th className="py-2.5 px-3">Backup Name</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Date & Time</th>
              <th className="py-2.5 px-3">Size</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-all">
                <td className="py-3 px-3 font-bold text-slate-800 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{item.name}</span>
                </td>
                <td className="py-3 px-3 uppercase font-mono text-[10px] text-slate-500">
                  {item.backupType}
                </td>
                <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">
                  {(item.sizeBytes / 1024).toFixed(1)} KB
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'valid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                </td>
                <td className="py-3 px-3 text-right space-x-2">
                  {onSelectBackupForRestore && (
                    <button
                      type="button"
                      onClick={() => onSelectBackupForRestore(item)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-all"
                    >
                      Restore
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
