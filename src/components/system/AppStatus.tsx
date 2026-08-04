import React from 'react';
import { useSystemContext } from '../../context/SystemContext';
import { ShieldCheck, Wifi, WifiOff, Cpu, HardDrive } from 'lucide-react';

export const AppStatus: React.FC = () => {
  const { isOffline, environment, isInstalled } = useSystemContext();

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            System & Deployment Health
          </h4>
        </div>
        <span className="font-mono text-[10px] text-slate-400">v{environment.appVersion}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
          {isOffline ? (
            <WifiOff className="w-4 h-4 text-amber-400" />
          ) : (
            <Wifi className="w-4 h-4 text-emerald-400" />
          )}
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Network</span>
            <span className="font-bold text-slate-200">{isOffline ? 'Offline Mode' : 'Online'}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">AI Engine</span>
            <span className="font-bold text-slate-200">
              {environment.hasGeminiKey ? 'Gemini Pro' : 'Heuristic Mode'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-sky-400" />
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Storage</span>
            <span className="font-bold text-slate-200">IndexedDB Local</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">PWA Mode</span>
            <span className="font-bold text-slate-200">{isInstalled ? 'Standalone App' : 'Web View'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
