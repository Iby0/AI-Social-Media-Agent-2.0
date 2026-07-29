import React, { useState } from 'react';
import { useRestore } from '../../hooks/useRestore';
import { useBackup } from '../../hooks/useBackup';
import { BackupMetadata, BackupPayload, BackupType } from '../../types/backup';
import { RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

export const RestoreWizard: React.FC<{
  selectedHistoryMeta?: BackupMetadata | null;
  onSuccess?: () => void;
}> = ({ selectedHistoryMeta, onSuccess }) => {
  const { history, importBackupFile } = useBackup();
  const { restoreBackup, isProcessing } = useRestore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPayload, setSelectedPayload] = useState<BackupPayload | null>(null);
  const [restoreType, setRestoreType] = useState<BackupType>('full');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [restoreResult, setRestoreResult] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);

    const res = await importBackupFile(file);
    if (res.errors.length > 0) {
      setErrorMsg(res.errors.join('; '));
    } else if (res.payload) {
      setSelectedPayload(res.payload);
      setRestoreType(res.payload.metadata.backupType);
      setStep(2);
    }
  };

  const handleExecuteRestore = async () => {
    if (!selectedPayload) return;
    setErrorMsg(null);
    try {
      const summary = await restoreBackup(selectedPayload, restoreType);
      setRestoreResult(summary);
      setStep(4);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Restore failed');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Database & System Restore Wizard</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600">
          Step {step} of 4
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Select a backup snapshot from history or upload a valid JSON/CSV backup file:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Box */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer relative">
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Upload Backup File</p>
                <p className="text-[10px] text-slate-400">JSON or CSV format</p>
              </div>
            </div>

            {/* Existing History */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 max-h-56 overflow-y-auto">
              <p className="text-xs font-bold text-slate-700">Stored Local Archives</p>
              {history.length === 0 ? (
                <p className="text-[11px] text-slate-400">No stored local snapshots found.</p>
              ) : (
                history.map((meta) => (
                  <button
                    key={meta.id}
                    type="button"
                    onClick={() => {
                      // Construct empty payload wrapper for history item
                      setSelectedPayload({ metadata: meta, data: {} });
                      setRestoreType(meta.backupType);
                      setStep(2);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 transition-all text-xs flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{meta.name}</p>
                      <p className="text-[10px] text-slate-400">{new Date(meta.timestamp).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-600">
                      {meta.backupType}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {step === 2 && selectedPayload && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">Select target restore mode:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(['full', 'content', 'settings', 'workflow', 'analytics', 'social_accounts'] as BackupType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setRestoreType(t)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  restoreType === t
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs uppercase font-mono">{t.replace('_', ' ')}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <span>Review Safety Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && selectedPayload && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Safety Check & Data Overwrite Confirmation</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-800">
              Restoring will replace existing local records for mode [{restoreType.toUpperCase()}]. An automatic safety backup will be created in IndexedDB prior to overwrite.
            </p>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleExecuteRestore}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Confirm & Execute Restore</span>
            </button>
          </div>
        </div>
      )}

      {step === 4 && restoreResult && (
        <div className="text-center space-y-4 py-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Restore Complete!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Restored {restoreResult.postsRestored} posts, {restoreResult.channelsRestored} channels, {restoreResult.workflowsRestored} workflows.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
