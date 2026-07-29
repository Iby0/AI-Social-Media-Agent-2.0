import React, { useState } from 'react';
import { useBackup } from '../../hooks/useBackup';
import { Download, FileJson, FileText, X } from 'lucide-react';
import { BackupType } from '../../types/backup';

export const ExportDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { createBackup, exportBackupJson, exportBackupCsv, isProcessing } = useBackup();
  const [selectedType, setSelectedType] = useState<BackupType>('full');
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv'>('json');

  if (!isOpen) return null;

  const handleExportNow = async () => {
    const payload = await createBackup(selectedType);
    if (selectedFormat === 'json') {
      exportBackupJson(payload);
    } else {
      exportBackupCsv(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Export System Data Package</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Export File Format</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedFormat('json')}
              className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                selectedFormat === 'json'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileJson className="w-5 h-5 text-indigo-600" />
              <span className="text-xs">JSON Snapshot</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('csv')}
              className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                selectedFormat === 'csv'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-5 h-5 text-emerald-600" />
              <span className="text-xs">CSV Summary</span>
            </button>
          </div>
        </div>

        {/* Scope selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Export Scope</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as BackupType)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="full">Full Backup (All Modules)</option>
            <option value="content">Content & Posts Only</option>
            <option value="settings">Settings & Configuration</option>
            <option value="workflow">Workflows & Pipelines</option>
            <option value="analytics">Analytics & Logs</option>
            <option value="social_accounts">Social Account Profiles</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExportNow}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate & Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
