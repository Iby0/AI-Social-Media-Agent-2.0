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
  Shield,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Globe,
  Power,
} from 'lucide-react';

export interface AccountTableProps {
  accounts: SocialAccountRecord[];
}

export const AccountTable: React.FC<AccountTableProps> = ({ accounts }) => {
  const {
    openDetails,
    reconnectAccount,
    disconnectAccount,
    refreshToken,
    toggleEnableAccount,
    removeAccount,
  } = useSocialAccounts();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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

  if (accounts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <Globe className="h-10 w-10 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">No Connected Accounts Found</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No social accounts match your active search filter criteria. Try clearing search filters or click "Connect New Account" above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3.5 px-4">Account</th>
              <th scope="col" className="py-3.5 px-4">Platform Type</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4">Health</th>
              <th scope="col" className="py-3.5 px-4">Token Status</th>
              <th scope="col" className="py-3.5 px-4">Connected</th>
              <th scope="col" className="py-3.5 px-4">Last Sync</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {accounts.map((account) => {
              const tokenSummary = tokenMonitorService.evaluateToken(account);
              const isEnabled = account.enabled !== false;
              const isMenuOpen = activeMenuId === account.id;

              return (
                <tr
                  key={account.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    !isEnabled ? 'opacity-50 grayscale-[20%]' : ''
                  }`}
                >
                  {/* Account Name & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={account.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={account.accountName}
                          className="h-9 w-9 rounded-xl object-cover border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-md bg-slate-950 border border-slate-800">
                          {getPlatformIcon(account.platform)}
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => openDetails(account)}
                          className="font-bold text-white hover:text-indigo-400 text-left transition-colors cursor-pointer"
                        >
                          {account.displayName || account.accountName}
                        </button>
                        <p className="text-[11px] text-slate-400 font-mono">@{account.accountId}</p>
                      </div>
                    </div>
                  </td>

                  {/* Platform Type */}
                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {account.accountType || account.platform}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        account.status === 'Connected'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : account.status === 'Expired'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          account.status === 'Connected' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span>{account.status}</span>
                    </span>
                  </td>

                  {/* Health */}
                  <td className="py-3.5 px-4">
                    <HealthBadge level={account.healthLevel || 'Good'} size="sm" />
                  </td>

                  {/* Token Status */}
                  <td className="py-3.5 px-4">
                    <TokenBadge
                      tokenState={tokenSummary.tokenState}
                      daysRemaining={tokenSummary.daysRemaining}
                      size="sm"
                    />
                  </td>

                  {/* Connected Date */}
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(account.connectedAt).toLocaleDateString()}
                  </td>

                  {/* Last Sync */}
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {account.lastSyncAt
                      ? new Date(account.lastSyncAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Just now'}
                  </td>

                  {/* Actions Menu */}
                  <td className="py-3.5 px-4 text-right relative">
                    <button
                      onClick={() => setActiveMenuId(isMenuOpen ? null : account.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      aria-label="Actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-4 top-10 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-30 text-left text-xs space-y-0.5">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            openDetails(account);
                          }}
                          className="w-full px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            reconnectAccount(account.id);
                          }}
                          className="w-full px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
                          <span>Reconnect Account</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            refreshToken(account.id);
                          }}
                          className="w-full px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Shield className="h-3.5 w-3.5 text-amber-400" />
                          <span>Refresh Token</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            toggleEnableAccount(account.id, !isEnabled);
                          }}
                          className="w-full px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Power className="h-3.5 w-3.5 text-slate-400" />
                          <span>{isEnabled ? 'Disable Sync' : 'Enable Sync'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            disconnectAccount(account.id);
                          }}
                          className="w-full px-3.5 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Unplug className="h-3.5 w-3.5 text-amber-400" />
                          <span>Disconnect</span>
                        </button>

                        <div className="border-t border-slate-800 my-1" />

                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            removeAccount(account.id);
                          }}
                          className="w-full px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove Account</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
