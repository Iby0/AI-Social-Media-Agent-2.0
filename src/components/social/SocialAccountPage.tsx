import React, { useState, useEffect, useCallback } from 'react';
import {
  Share2,
  Plus,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  Key,
  Lock,
  Code2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { SocialAccountRecord } from '../../database/types';
import { socialService, SocialAccountStats } from '../../services/social/social.service';
import { SocialAccountList } from './SocialAccountList';
import { ConnectButton } from './ConnectButton';
import { ConnectModal } from './ConnectModal';
import { FacebookConnectCard } from './meta/FacebookConnectCard';
import { InstagramConnectCard } from './meta/InstagramConnectCard';

export const SocialAccountPage: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccountRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [showFlowDiagram, setShowFlowDiagram] = useState(true);

  const [stats, setStats] = useState<SocialAccountStats>({
    total: 0,
    connected: 0,
    disconnected: 0,
    expired: 0,
    error: 0,
    pending: 0,
  });

  const loadAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await socialService.getAccounts({
        status: selectedStatus,
        platform: selectedPlatform,
        searchQuery,
      });
      setAccounts(data);

      const metricStats = await socialService.getAccountStats();
      setStats(metricStats);
    } catch (err) {
      console.error('Failed to load social accounts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, selectedPlatform, searchQuery]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const facebookAccount = accounts.find((a) => a.platform === 'facebook');
  const instagramAccount = accounts.find((a) => a.platform === 'instagram');

  const asciiFacebookFlow = `
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            FACEBOOK PAGE CONNECTION FLOW                         │
└──────────────────────────────────────────────────────────────────────────────────┘
  User ──► Connect Facebook ──► Meta OAuth Authorization ──► Permission Request
                                                                   │
  Connected ◄── Save Connection ◄── Select Page ◄── Get User Pages ◄─ Access Token
`;

  const asciiInstagramFlow = `
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           INSTAGRAM BUSINESS ACCOUNT FLOW                         │
└──────────────────────────────────────────────────────────────────────────────────┘
  User ──► Connect Facebook ──► Find Connected IG Business ──► Verify ──► Connected
`;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Module 13
            </span>
            <span className="text-xs text-slate-400">Meta Platform Integration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Facebook Page & Instagram Business Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Official Meta Graph API authorization, page selection, linked Instagram Business account discovery, and scope security management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadAccounts}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
            title="Refresh Account List"
          >
            <RefreshCw size={16} />
          </button>

          <ConnectButton onClick={() => setIsConnectModalOpen(true)} label="Connect Account" />
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-100">{stats.total}</div>
            <div className="text-xs font-medium text-slate-400">Total Accounts</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-100">{stats.connected}</div>
            <div className="text-xs font-medium text-slate-400">Active Connected</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-100">{stats.expired}</div>
            <div className="text-xs font-medium text-slate-400">Tokens Expired</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Lock size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-100">Meta API v18.0</div>
            <div className="text-xs font-medium text-slate-400">Facebook & Instagram</div>
          </div>
        </div>
      </div>

      {/* Dedicated Meta Integration Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FacebookConnectCard
          connectedAccount={facebookAccount}
          onRefreshList={loadAccounts}
        />
        <InstagramConnectCard
          connectedAccount={instagramAccount}
          onRefreshList={loadAccounts}
        />
      </div>

      {/* Meta OAuth Connection Flows ASCII Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <button
          type="button"
          onClick={() => setShowFlowDiagram(!showFlowDiagram)}
          className="w-full px-5 py-3.5 bg-slate-950/60 flex items-center justify-between text-left hover:bg-slate-950 transition-colors border-b border-slate-800/60"
        >
          <div className="flex items-center gap-2.5">
            <Code2 size={16} className="text-indigo-400" />
            <span className="font-bold text-xs text-slate-200 uppercase tracking-wider">
              Facebook Page & Instagram Business OAuth Connection Flows
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span>{showFlowDiagram ? 'Hide Flows' : 'Show Flows'}</span>
            {showFlowDiagram ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {showFlowDiagram && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 overflow-x-auto font-mono text-[11px] text-blue-300 leading-relaxed">
                <pre className="whitespace-pre">{asciiFacebookFlow}</pre>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 overflow-x-auto font-mono text-[11px] text-pink-300 leading-relaxed">
                <pre className="whitespace-pre">{asciiInstagramFlow}</pre>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-indigo-400 block">Page Access Token</span>
                <p className="text-slate-400 text-[11px]">
                  Long-lived page access tokens are generated following Meta user OAuth authorization and page selection.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-indigo-400 block">Instagram Graph Discovery</span>
                <p className="text-slate-400 text-[11px]">
                  Automatically identifies attached Instagram Business Accounts linked to authorized Facebook Pages.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-indigo-400 block">Permission Evaluator</span>
                <p className="text-slate-400 text-[11px]">
                  Audits granted scopes like pages_manage_posts and instagram_content_publish to ensure token security.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Account Management List */}
      <SocialAccountList
        accounts={accounts}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        onConnectClick={() => setIsConnectModalOpen(true)}
        onRefreshList={loadAccounts}
      />

      {/* Connect Modal */}
      {isConnectModalOpen && (
        <ConnectModal
          onClose={() => setIsConnectModalOpen(false)}
          onConnected={loadAccounts}
        />
      )}
    </div>
  );
};

