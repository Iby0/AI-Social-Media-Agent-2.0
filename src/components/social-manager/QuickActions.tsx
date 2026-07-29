import React, { useState } from 'react';
import { useSocialAccounts } from './SocialAccountContext';
import { Plus, RefreshCw, Activity, ShieldCheck, History, Check } from 'lucide-react';

export interface QuickActionsProps {
  onToggleHistoryView?: () => void;
  showingHistoryView?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onToggleHistoryView,
  showingHistoryView = false,
}) => {
  const { openConnectModal, refreshAllTokens, accounts, checkHealth } = useSocialAccounts();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      const res = await refreshAllTokens();
      showToast(`Refreshed tokens: ${res.successCount} succeeded, ${res.errorCount} failed.`);
    } catch (err) {
      console.error(err);
      showToast('Error during token refresh.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCheckHealthAll = async () => {
    setIsCheckingHealth(true);
    try {
      for (const acc of accounts) {
        await checkHealth(acc.id);
      }
      showToast(`Health checked across all ${accounts.length} connected accounts.`);
    } catch (err) {
      console.error(err);
      showToast('Error checking account health.');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Toast feedback pill */}
      {toastMessage && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-fade-in">
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        <button
          onClick={() => openConnectModal()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 border border-indigo-500/40 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Connect New Account</span>
        </button>

        <button
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh OAuth Tokens across all connected accounts"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh All Tokens'}</span>
        </button>

        <button
          onClick={handleCheckHealthAll}
          disabled={isCheckingHealth}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          title="Verify connection health against API adapters"
        >
          <Activity className={`h-3.5 w-3.5 text-blue-400 ${isCheckingHealth ? 'animate-pulse' : ''}`} />
          <span>{isCheckingHealth ? 'Evaluating...' : 'Check Health'}</span>
        </button>

        <button
          onClick={() => openConnectModal()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          title="Manage OAuth App Scopes & Permissions"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Manage Permissions</span>
        </button>

        {onToggleHistoryView && (
          <button
            onClick={onToggleHistoryView}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              showingHistoryView
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span>{showingHistoryView ? 'View Accounts' : 'View History Logs'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
