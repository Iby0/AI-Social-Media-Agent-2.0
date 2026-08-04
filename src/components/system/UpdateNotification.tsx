import React from 'react';
import { useSystemContext } from '../../context/SystemContext';
import { RefreshCw, Sparkles } from 'lucide-react';

export const UpdateNotification: React.FC = () => {
  const { updateAvailable, applyUpdate } = useSystemContext();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
      <div className="bg-emerald-950 text-white border border-emerald-700/80 p-4 rounded-2xl shadow-2xl flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-5 h-5 text-emerald-300" />
        </div>

        <div className="text-xs space-y-1">
          <p className="font-bold text-emerald-200">New App Version Ready</p>
          <p className="text-emerald-400/80 text-[11px]">Click update to reload with latest features.</p>
        </div>

        <button
          type="button"
          onClick={applyUpdate}
          className="ml-2 px-3 py-1.5 rounded-xl font-bold text-xs text-emerald-950 bg-white hover:bg-emerald-50 shadow-md transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Update Now</span>
        </button>
      </div>
    </div>
  );
};
