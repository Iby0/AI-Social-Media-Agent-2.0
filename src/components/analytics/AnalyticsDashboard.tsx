import React, { useState } from 'react';
import { AnalyticsProvider } from '../../context/AnalyticsContext';
import { OverviewCards } from './OverviewCards';
import { ChartPanel } from './ChartPanel';
import { PlatformReport } from './PlatformReport';
import { ErrorTable } from './ErrorTable';
import { LogViewer } from './LogViewer';
import { ExportDialog } from './ExportDialog';
import { Activity, Download, RefreshCw, ShieldCheck, BarChart3, HardDrive } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

const InnerAnalyticsDashboard: React.FC = () => {
  const { refreshAnalytics } = useAnalytics();
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Activity className="w-3 h-3" /> System Analytics & Diagnostics
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> 100% On-Device Local Data
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Analytics, Monitoring & System Reporting Center
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Real-time tracking of AI content generation, official publishing dispatch rates, IndexedDB quota growth, and system error diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 relative z-10">
          <button
            type="button"
            onClick={refreshAnalytics}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Refresh Diagnostics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Charts & Platform Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartPanel />
          <PlatformReport />
        </div>
        <div className="space-y-6">
          <ErrorTable />
          <LogViewer />
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};

export const AnalyticsDashboard: React.FC = () => {
  return (
    <AnalyticsProvider>
      <InnerAnalyticsDashboard />
    </AnalyticsProvider>
  );
};
