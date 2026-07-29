import React, { useState } from 'react';
import { useBackup } from '../../hooks/useBackup';
import { BackupType } from '../../types/backup';
import { Database, Download, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const BackupWizard: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { createBackup, exportBackupJson, exportBackupCsv, isProcessing } = useBackup();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [backupType, setBackupType] = useState<BackupType>('full');
  const [customName, setCustomName] = useState('');
  const [generatedPayload, setGeneratedPayload] = useState<any>(null);

  const backupTypesList: { type: BackupType; title: string; desc: string }[] = [
    { type: 'full', title: 'Full Backup', desc: 'Complete system snapshot (Content, Accounts, Workflows, Settings, Analytics)' },
    { type: 'content', title: 'Content Backup', desc: 'Drafts, published posts, media items, and campaign records' },
    { type: 'settings', title: 'Settings Backup', desc: 'System configuration, backup rules, and general application preferences' },
    { type: 'workflow', title: 'Workflow Backup', desc: 'Visual node pipelines, triggers, and execution steps' },
    { type: 'analytics', title: 'Analytics Backup', desc: 'Activity logs, diagnostic records, error reports, and time series' },
    { type: 'automation_rules', title: 'Automation Rules Backup', desc: 'Autonomous trigger rules and recurring schedule configs' },
    { type: 'social_accounts', title: 'Social Account Metadata', desc: 'Channel metadata and connected page profiles (tokens auto-redacted)' },
  ];

  const handleGenerateBackup = async () => {
    const payload = await createBackup(backupType, customName || undefined);
    setGeneratedPayload(payload);
    setStep(3);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Create New Local Backup Wizard</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600">
          Step {step} of 3
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">Select the scope of data you wish to backup:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {backupTypesList.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setBackupType(item.type)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  backupType === item.type
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <span>Continue to Naming</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Custom Backup Label / Name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={`e.g. Pre-Release ${backupType.toUpperCase()} Snapshot`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400">Optional. A default timestamped name will be assigned if left empty.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Scope:</span>
              <span className="font-bold uppercase font-mono">{backupType}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Security Masking:</span>
              <span className="font-bold text-emerald-600">Tokens Auto-Redacted</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Storage Target:</span>
              <span className="font-bold">IndexedDB & Direct File Download</span>
            </div>
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
              onClick={handleGenerateBackup}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Generate & Save Backup</span>
            </button>
          </div>
        </div>
      )}

      {step === 3 && generatedPayload && (
        <div className="text-center space-y-4 py-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Backup Successfully Created!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Your snapshot [{generatedPayload.metadata.name}] is now stored in local history.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => exportBackupJson(generatedPayload)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>

            <button
              type="button"
              onClick={() => exportBackupCsv(generatedPayload)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              Create Another Backup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
