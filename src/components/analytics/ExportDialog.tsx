import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import { Download, FileJson, FileText, Printer, ShieldCheck, X } from 'lucide-react';
import { ExportFormat } from '../../types/analytics';

export const ExportDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { exportReport, retentionDays, updateRetentionDays } = useReports();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');

  if (!isOpen) return null;

  const handleExport = () => {
    exportReport(selectedFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Export System Analytics Report</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Sanitized export containing system performance metrics, error summaries, and log activities. Sensitive API credentials are auto-redacted.
        </p>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Export Format</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedFormat('json')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedFormat === 'json'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileJson className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold">JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('csv')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedFormat === 'csv'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold">CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('pdf')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedFormat === 'pdf'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Printer className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-bold">PDF Summary</span>
            </button>
          </div>
        </div>

        {/* Retention Setting */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Log Retention Window</span>
            <span className="font-mono text-indigo-600 font-bold">{retentionDays} Days</span>
          </div>
          <input
            type="range"
            min={7}
            max={90}
            step={7}
            value={retentionDays}
            onChange={(e) => updateRetentionDays(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <p className="text-[10px] text-slate-400">
            Logs and error events older than {retentionDays} days are automatically pruned from IndexedDB.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
