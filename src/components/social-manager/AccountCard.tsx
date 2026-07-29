import React, { useState } from 'react';
import { SocialAccountRecord } from '../../database/types';
import { useSocialAccounts } from './SocialAccountContext';
import { HealthBadge } from './HealthBadge';
import { TokenBadge } from './TokenBadge';
import { tokenMonitorService } from '../../services/social-manager/token-monitor.service';
import {
  MoreVertical,
  ExternalLink,
  RefreshCw,
  Unplug,
  Edit2,
  Trash2,
  CheckCircle2,
  Power,
  Shield,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Globe,
} from 'lucide-react';

export interface AccountCardProps {
  account: SocialAccountRecord;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const {
    openDetails,
    reconnectAccount,
    disconnectAccount,
    refreshToken,
    toggleEnableAccount,
    removeAccount,
    renameDisplayName,
  } = useSocialAccounts();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(account.displayName || account.accountName);

  const tokenSummary = tokenMonitorService.evaluateToken(account);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-500" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-sky-500" />;
      case 'github':
        return <Github className="h-4 w-4 text-slate-200" />;
      default:
        return <Globe className="h-4 w-4 text-indigo-400" />;
    }
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDisplayName.trim()) {
      await renameDisplayName(account.id, newDisplayName.trim());
      setIsRenaming(false);
    }
  };

  const isEnabled = account.enabled !== false;

  return (
    <div
      className={`relative rounded-2xl border bg-slate-900/90 p-5 space-y-4 transition-all duration-200 hover:border-slate-700 shadow-xl ${
        !isEnabled ? 'opacity-60 grayscale-[30%]' : ''
      } ${
        account.status === 'Expired' || account.status === 'Error'
          ? 'border-amber-500/30'
          : 'border-slate-800'
      }`}
    >
      {/* Header: Platform & Quick Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={account.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={account.accountName}
              className="h-12 w-12 rounded-xl object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
              {getPlatformIcon(account.platform)}
            </div>
          </div>

          <div className="space-y-0.5">
            {isRenaming ? (
              <form onSubmit={handleSaveRename} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="bg-slate-950 border border-indigo-500/50 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-semibold"
                >
                  Save
                </button>
              </form>
            ) : (
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 group">
                <span className="truncate">{account.displayName || account.accountName}</span>
                <button
                  onClick={() => setIsRenaming(true)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-indigo-400 text-slate-500 transition-opacity"
                  title="Rename Display Name"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              </h3>
            )}
            <p className="text-xs text-slate-400 truncate">{account.accountType}</p>
          </div>
        </div>

        {/* Action Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Account Menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-8 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-30 space-y-0.5 text-xs">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openDetails(account);
                }}
                className="w-full text-left px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
                <span>View Account Details</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  reconnectAccount(account.id);
                }}
                className="w-full text-left px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
                <span>Reconnect / Re-authorize</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  refreshToken(account.id);
                }}
                className="w-full text-left px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Shield className="h-3.5 w-3.5 text-amber-400" />
                <span>Refresh OAuth Token</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsRenaming(true);
                }}
                className="w-full text-left px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                <span>Rename Display Name</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  toggleEnableAccount(account.id, !isEnabled);
                }}
                className="w-full text-left px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Power className="h-3.5 w-3.5 text-slate-400" />
                <span>{isEnabled ? 'Disable Account' : 'Enable Account'}</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  disconnectAccount(account.id);
                }}
                className="w-full text-left px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Unplug className="h-3.5 w-3.5 text-amber-400" />
                <span>Disconnect</span>
              </button>

              <div className="border-t border-slate-800 my-1" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  removeAccount(account.id);
                }}
                className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Account</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Badges Bar: Health & Token */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <HealthBadge level={account.healthLevel || 'Good'} />
        <TokenBadge tokenState={tokenSummary.tokenState} daysRemaining={tokenSummary.daysRemaining} />
      </div>

      {/* Connection Info */}
      <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
        <div className="flex justify-between">
          <span className="text-slate-500">Connected:</span>
          <span>{new Date(account.connectedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Last Sync:</span>
          <span>{account.lastSyncAt ? new Date(account.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Token Mask:</span>
          <span className="font-mono text-slate-300">{tokenSummary.maskedToken}</span>
        </div>
      </div>

      {/* Enable/Disable Switch & View Details CTA */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-400">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => toggleEnableAccount(account.id, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 relative"></div>
          <span className="text-[11px] font-semibold">{isEnabled ? 'Active' : 'Disabled'}</span>
        </label>

        <button
          onClick={() => openDetails(account)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Manage</span>
          <CheckCircle2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
