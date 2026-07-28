import React from 'react';
import { Bot, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export interface NavbarBaseProps {
  appName?: string;
  isSyncing?: boolean;
  onRefreshData?: () => void;
  rightAction?: React.ReactNode;
}

export const NavbarBase: React.FC<NavbarBaseProps> = ({
  appName = 'AI Social Media Agent',
  isSyncing = false,
  onRefreshData,
  rightAction,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-tight">{appName}</h1>
            <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              v2.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            Autonomous Social Content Studio & Multi-Channel Publisher
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>IndexedDB Ready</span>
        </div>

        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isSyncing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Reload Database"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        )}

        <ThemeToggle />

        {rightAction}
      </div>
    </header>
  );
};
