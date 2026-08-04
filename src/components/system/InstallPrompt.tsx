import React, { useState } from 'react';
import { useSystemContext } from '../../context/SystemContext';
import { Download, X, Sparkles } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, triggerInstall } = useSystemContext();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className="bg-indigo-900 text-white border border-indigo-700/80 p-4 rounded-2xl shadow-2xl max-w-sm flex items-start gap-3 relative overflow-hidden">
        <div className="p-2.5 rounded-xl bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 shrink-0">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>

        <div className="space-y-2 flex-1 text-xs">
          <div>
            <h4 className="font-bold text-white text-sm">Install Desktop / Mobile App</h4>
            <p className="text-indigo-200 text-[11px] leading-relaxed">
              Install AI Social Agent as a Progressive Web App for fast offline access and native notifications.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={triggerInstall}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-950 bg-white hover:bg-indigo-50 shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Install App</span>
            </button>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-indigo-300 hover:text-white transition-all"
            >
              Not now
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-indigo-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
