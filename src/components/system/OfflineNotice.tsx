import React from 'react';
import { useSystemContext } from '../../context/SystemContext';
import { WifiOff, Database } from 'lucide-react';

export const OfflineNotice: React.FC = () => {
  const { isOffline } = useSystemContext();

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slideUp">
      <div className="bg-slate-900 text-white border border-slate-700 p-3.5 px-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <WifiOff className="w-4 h-4" />
        </div>

        <div className="text-xs">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <span>Offline Mode Active</span>
            <span className="inline-flex items-center gap-1 text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200">
              <Database className="w-2.5 h-2.5" /> IndexedDB
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">Working from local browser storage cleanly.</p>
        </div>
      </div>
    </div>
  );
};
