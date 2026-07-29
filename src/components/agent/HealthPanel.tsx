import React from 'react';
import { useAutomation } from '../../hooks/useAutomation';
import { Activity, HardDrive, ShieldCheck, Layers, AlertCircle, RefreshCw } from 'lucide-react';

export const HealthPanel: React.FC = () => {
  const { health, refreshHealth } = useAutomation();

  if (!health) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center text-xs text-slate-500">
        Loading agent health diagnostics...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Health & Infrastructure Monitor</h3>
        </div>
        <button
          type="button"
          onClick={refreshHealth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          title="Refresh Health Diagnostics"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* AI Service */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">AI Service</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xs font-bold text-slate-900 capitalize">{health.aiAvailability}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Gemini 2.5 API</p>
        </div>

        {/* IndexedDB Storage */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Storage</span>
            <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <p className="text-xs font-bold text-slate-900">{health.storageUsagePercent}% Quota</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Local Persistence</p>
        </div>

        {/* Queue Size */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Pending Queue</span>
            <Layers className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-xs font-bold text-slate-900">{health.queueSize} Items</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Publisher Dispatch</p>
        </div>

        {/* Workflow Errors */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase">Workflow Errors</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-xs font-bold text-slate-900">{health.workflowErrorsCount} Errors</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Retries Handling</p>
        </div>
      </div>
    </div>
  );
};
