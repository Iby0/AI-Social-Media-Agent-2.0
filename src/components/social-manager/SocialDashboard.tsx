import React, { useState } from 'react';
import { useSocialAccounts } from './SocialAccountContext';
import { OverviewCards } from './OverviewCards';
import { QuickActions } from './QuickActions';
import { FilterPanel } from './FilterPanel';
import { AccountTable } from './AccountTable';
import { AccountCard } from './AccountCard';
import { AccountDetails } from './AccountDetails';
import { ConnectionTimeline } from './ConnectionTimeline';
import { healthService } from '../../services/social-manager/health.service';
import { SocialPlatform } from '../../database/types';
import {
  Share2,
  ShieldCheck,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  X,
  Sparkles,
  Activity,
  Layers,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const SocialDashboard: React.FC = () => {
  const {
    accounts,
    isLoading,
    isConnectModalOpen,
    selectedConnectPlatform,
    closeConnectModal,
    connectAccount,
    openConnectModal,
  } = useSocialAccounts();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showingHistory, setShowingHistory] = useState(false);
  const [showingHealthGuide, setShowingHealthGuide] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<SocialPlatform | null>(null);

  const healthMatrix = healthService.getHealthCalculationExplanation();

  const handleTriggerConnect = async (platform: SocialPlatform) => {
    setConnectingPlatform(platform);
    try {
      await connectAccount(platform, `demo_code_${Date.now()}`);
      closeConnectModal();
    } catch (err) {
      console.error(err);
    } finally {
      setConnectingPlatform(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Share2 className="h-3.5 w-3.5" />
              <span>Unified Social Account Engine v15.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Social Account Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Manage all connected platform permissions, monitor OAuth token health, configure channel sync settings, and track connection logs in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowingHealthGuide(!showingHealthGuide)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <HelpCircle className="h-4 w-4 text-indigo-400" />
              <span>Health Matrix Rules</span>
            </button>
            <button
              onClick={() => openConnectModal()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 border border-indigo-500/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Connect Platform</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards Section */}
      <OverviewCards />

      {/* Quick Action Bar */}
      <QuickActions
        showingHistoryView={showingHistory}
        onToggleHistoryView={() => setShowingHistory(!showingHistory)}
      />

      {/* Health Calculation Explanation Panel */}
      {showingHealthGuide && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Activity className="h-4 w-4" />
              <span>{healthMatrix.title}</span>
            </div>
            <button
              onClick={() => setShowingHealthGuide(false)}
              className="text-slate-500 hover:text-white p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {healthMatrix.criteria.map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-white">{item.level}</span>
                  <span className="text-indigo-400 font-mono text-[10px]">{item.scoreRange}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-tight">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area: History vs Accounts View */}
      {showingHistory ? (
        <ConnectionTimeline />
      ) : (
        <div className="space-y-4">
          {/* Filter & Search Controls */}
          <FilterPanel viewMode={viewMode} setViewMode={setViewMode} />

          {/* Account List Display (Table or Grid Cards) */}
          {isLoading ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-semibold">Syncing social accounts & health telemetry...</p>
            </div>
          ) : viewMode === 'table' ? (
            <AccountTable accounts={accounts} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((acc) => (
                <AccountCard key={acc.id} account={acc} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Side Details Panel Drawer */}
      <AccountDetails />

      {/* Connect Platform Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connect Social Platform</h3>
                  <p className="text-xs text-slate-400">Select channel to initiate OAuth authorization</p>
                </div>
              </div>
              <button
                onClick={closeConnectModal}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Platform Choice Options */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'facebook', name: 'Facebook Page', icon: Facebook, color: 'text-blue-500', desc: 'Pages & Lead Messaging' },
                { id: 'instagram', name: 'Instagram Business', icon: Instagram, color: 'text-pink-500', desc: 'Business Professional Media' },
                { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-sky-500', desc: 'Member & Company Page' },
                { id: 'github', name: 'GitHub Developer', icon: Github, color: 'text-slate-200', desc: 'User Repos & Webhooks' },
              ].map((pl) => {
                const Icon = pl.icon;
                const isSelected = selectedConnectPlatform === pl.id;
                const isBusy = connectingPlatform === pl.id;

                return (
                  <button
                    key={pl.id}
                    onClick={() => handleTriggerConnect(pl.id as SocialPlatform)}
                    disabled={isBusy}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between h-32 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/40'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`h-6 w-6 ${pl.color}`} />
                      {isBusy && <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">{pl.name}</h4>
                      <p className="text-[11px] text-slate-500">{pl.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                All OAuth 2.0 logins use encrypted token exchange. Tokens are safely stored locally inside IndexedDB.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
