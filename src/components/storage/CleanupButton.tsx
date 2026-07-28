import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Sparkles, Trash2, RefreshCw, ChevronDown, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CleanupReport } from '../../storage/types';

interface CleanupButtonProps {
  onRunCleanup: (mode: 'manual' | 'auto') => Promise<CleanupReport>;
  isCleaning?: boolean;
}

export const CleanupButton: React.FC<CleanupButtonProps> = ({ onRunCleanup, isCleaning = false }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleTrigger = async () => {
    setShowOptions(false);
    await onRunCleanup('manual');
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1">
        <Button
          variant="primary"
          size="sm"
          onClick={handleTrigger}
          disabled={isCleaning}
          leftIcon={
            isCleaning ? (
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Sparkles className="h-4 w-4 text-amber-300" />
            )
          }
          className="shadow-lg shadow-indigo-600/20"
        >
          {isCleaning ? 'Running Cleanup...' : 'Run Auto Cleanup'}
        </Button>

        <button
          onClick={() => setShowOptions(!showOptions)}
          disabled={isCleaning}
          className="p-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white transition-colors cursor-pointer border border-indigo-500/30"
          title="Cleanup Options"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-30 p-2 space-y-1 animate-fadeIn">
          <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Cleanup Execution Modes
          </div>

          <button
            onClick={handleTrigger}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors cursor-pointer text-left"
          >
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold">Standard Smart Clean</div>
              <div className="text-[10px] text-slate-400 font-normal">
                Removes old logs, temp files & duplicate media
              </div>
            </div>
          </button>

          <button
            onClick={handleTrigger}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
          >
            <Trash2 className="h-4 w-4 text-rose-400 shrink-0" />
            <div>
              <div className="font-bold">Deep Storage Purge</div>
              <div className="text-[10px] text-slate-400 font-normal">
                Clears all temporary data, cache & incomplete uploads
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
