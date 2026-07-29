import React, { useState } from 'react';
import { useSocialAccounts } from './SocialAccountContext';
import { HealthBadge } from './HealthBadge';
import { TokenBadge } from './TokenBadge';
import { HealthEvaluationResult, healthService } from '../../services/social-manager/health.service';
import { tokenMonitorService } from '../../services/social-manager/token-monitor.service';
import {
  X,
  RefreshCw,
  Unplug,
  Shield,
  Edit2,
  Trash2,
  Key,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Globe,
  Info,
} from 'lucide-react';

export const AccountDetails: React.FC = () => {
  const {
    selectedAccount,
    isDetailsOpen,
    closeDetails,
    reconnectAccount,
    disconnectAccount,
    refreshToken,
    renameDisplayName,
    toggleEnableAccount,
    removeAccount,
    checkHealth,
    connectionHistory,
  } = useSocialAccounts();

  const [isEditingName, setIsEditingName] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'health' | 'history' | 'permissions'>('profile');
  const [healthEval, setHealthEval] = useState<HealthEvaluationResult | null>(null);

  if (!isDetailsOpen || !selectedAccount) return null;

  const tokenSummary = tokenMonitorService.evaluateToken(selectedAccount);
  const currentHealth = healthEval || healthService.evaluateHealth(selectedAccount);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-500" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-sky-500" />;
      case 'github':
        return <Github className="h-5 w-5 text-slate-200" />;
      default:
        return <Globe className="h-5 w-5 text-indigo-400" />;
    }
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayNameInput.trim()) {
      await renameDisplayName(selectedAccount.id, displayNameInput.trim());
      setIsEditingName(false);
    }
  };

  const handleRunHealthCheck = async () => {
    await checkHealth(selectedAccount.id);
    const updated = healthService.evaluateHealth(selectedAccount);
    setHealthEval(updated);
  };

  const accountHistory = connectionHistory.filter((h) => h.accountId === selectedAccount.id);
  const isEnabled = selectedAccount.enabled !== false;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedAccount.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={selectedAccount.accountName}
                className="h-12 w-12 rounded-xl object-cover border border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
                {getPlatformIcon(selectedAccount.platform)}
              </div>
            </div>

            <div>
              {isEditingName ? (
                <form onSubmit={handleSaveRename} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    className="bg-slate-950 border border-indigo-500 rounded-lg px-2 py-0.5 text-xs text-white"
                    placeholder={selectedAccount.accountName}
                    autoFocus
                  />
                  <button type="submit" className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                    Save
                  </button>
                </form>
              ) : (
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>{selectedAccount.displayName || selectedAccount.accountName}</span>
                  <button
                    onClick={() => {
                      setDisplayNameInput(selectedAccount.displayName || selectedAccount.accountName);
                      setIsEditingName(true);
                    }}
                    className="p-1 hover:text-indigo-400 text-slate-500"
                    title="Edit Display Name"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </h2>
              )}
              <p className="text-xs text-slate-400">{selectedAccount.accountType || selectedAccount.platform}</p>
            </div>
          </div>

          <button
            onClick={closeDetails}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 text-xs font-semibold">
          {[
            { id: 'profile', label: 'Overview & Profile' },
            { id: 'health', label: 'Account Health' },
            { id: 'permissions', label: 'OAuth & Token' },
            { id: 'history', label: 'Connection History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 space-y-6">
          {/* TAB 1: Profile & Overview */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Health & Token Summary Pill Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Health Assessment
                  </span>
                  <div>
                    <HealthBadge level={currentHealth.level} size="md" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Token Validity
                  </span>
                  <div>
                    <TokenBadge
                      tokenState={tokenSummary.tokenState}
                      daysRemaining={tokenSummary.daysRemaining}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Profile Information
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Account ID</span>
                    <span className="text-slate-200 font-mono">{selectedAccount.accountId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Platform</span>
                    <span className="text-slate-200 capitalize">{selectedAccount.platform}</span>
                  </div>
                  {selectedAccount.email && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Associated Email</span>
                      <span className="text-slate-200">{selectedAccount.email}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block text-[11px]">Sync Status</span>
                    <span className="text-slate-200">{isEnabled ? 'Active Sync Enabled' : 'Sync Disabled'}</span>
                  </div>
                  {selectedAccount.repositoriesCount !== undefined && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Repositories</span>
                      <span className="text-slate-200">{selectedAccount.repositoriesCount} Repos</span>
                    </div>
                  )}
                  {selectedAccount.headline && (
                    <div className="col-span-2">
                      <span className="text-slate-500 block text-[11px]">Headline</span>
                      <span className="text-slate-200">{selectedAccount.headline}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sync Timestamps */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sync & Connection Timeline
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4 text-indigo-400" />
                      <span>Initially Connected</span>
                    </div>
                    <span className="font-mono text-slate-200">
                      {new Date(selectedAccount.connectedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <span>Last API Activity / Sync</span>
                    </div>
                    <span className="font-mono text-slate-200">
                      {selectedAccount.lastSyncAt
                        ? new Date(selectedAccount.lastSyncAt).toLocaleString()
                        : 'Just now'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Health Breakdown */}
          {activeTab === 'health' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Health Matrix Score</h3>
                  <button
                    onClick={handleRunHealthCheck}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Activity className="h-3.5 w-3.5" />
                    <span>Run Diagnostic</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="text-3xl font-black text-indigo-400">{currentHealth.score}%</div>
                  <div>
                    <HealthBadge level={currentHealth.level} size="lg" />
                    <p className="text-slate-400 mt-1">{currentHealth.statusText}</p>
                  </div>
                </div>
              </div>

              {/* Health Reasons */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-300">Diagnostic Findings:</h4>
                <ul className="space-y-1.5">
                  {currentHealth.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 space-y-1">
                <span className="font-bold block">Recommended Action:</span>
                <p>{currentHealth.recommendation}</p>
              </div>
            </div>
          )}

          {/* TAB 3: Permissions & Token */}
          {activeTab === 'permissions' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Key className="h-4 w-4" />
                  <span>OAuth 2.0 Access Token</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Masked Token:</span>
                    <span className="font-mono text-slate-200">{tokenSummary.maskedToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expires In:</span>
                    <span className="font-mono text-slate-200">
                      {tokenSummary.daysRemaining} days ({tokenSummary.hoursRemaining} hours)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Raw Expiry Timestamp:</span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {selectedAccount.tokenExpiry || 'Never (Long Lived Token)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Platform Scopes & Permissions */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-300">Granted Scopes & API Permissions</h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  {(selectedAccount.permissions || ['public_profile', 'pages_read_engagement', 'pages_manage_posts', 'publish_actions']).map((perm, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="font-mono">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Connection History */}
          {activeTab === 'history' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-300">Recent Account Activity</h4>
              {accountHistory.length === 0 ? (
                <div className="p-6 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500">
                  No connection events logged for this account yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {accountHistory.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-indigo-400">{item.action}</span>
                        <span className="text-slate-500 text-[11px] font-mono">
                          {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-300">{item.result}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => reconnectAccount(selectedAccount.id)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
              <span>Reconnect</span>
            </button>

            <button
              onClick={() => refreshToken(selectedAccount.id)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5 text-amber-400" />
              <span>Refresh Token</span>
            </button>

            <button
              onClick={() => toggleEnableAccount(selectedAccount.id, !isEnabled)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEnabled ? 'Disable Account' : 'Enable Account'}</span>
            </button>

            <button
              onClick={() => disconnectAccount(selectedAccount.id)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unplug className="h-3.5 w-3.5" />
              <span>Disconnect</span>
            </button>
          </div>

          <button
            onClick={() => removeAccount(selectedAccount.id)}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Remove Account Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
