import React, { useState } from 'react';
import { useBackup } from '../../hooks/useBackup';
import { Upload, X, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';
import { BackupPayload } from '../../types/backup';

export const ImportDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onPayloadImported: (payload: BackupPayload) => void;
}> = ({ isOpen, onClose, onPayloadImported }) => {
  const { importBackupFile } = useBackup();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importedPayload, setImportedPayload] = useState<BackupPayload | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);

    const res = await importBackupFile(file);
    if (res.errors.length > 0) {
      setErrorMsg(res.errors.join('; '));
    } else if (res.payload) {
      setImportedPayload(res.payload);
    }
  };

  const handleConfirm = () => {
    if (importedPayload) {
      onPayloadImported(importedPayload);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Import External Backup File</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!importedPayload ? (
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 text-center space-y-2 relative cursor-pointer">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileCode className="w-8 h-8 text-indigo-500 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Choose JSON or CSV Backup File</p>
            <p className="text-[10px] text-slate-400">Validated with SHA-256 checksum & version check</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Valid Backup Snapshot Loaded</span>
            </div>
            <div className="space-y-1 text-[11px] text-emerald-700">
              <p>Name: {importedPayload.metadata.name}</p>
              <p>Type: {importedPayload.metadata.backupType}</p>
              <p>Version: {importedPayload.metadata.backupVersion}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          {importedPayload && (
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Proceed to Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
