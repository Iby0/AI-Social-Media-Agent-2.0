import React, { useState } from 'react';
import { Github, RefreshCw, Unlink, ExternalLink, ShieldCheck, CheckCircle2, GitFork, Mail } from 'lucide-react';
import { SocialAccountRecord } from '../../database/types';
import { OAuthStatus } from './OAuthStatus';

interface GitHubConnectCardProps {
  account?: SocialAccountRecord | null;
  onConnect: () => void;
  onDisconnect: (accountId: string) => void;
  onViewDetails?: (account: SocialAccountRecord) => void;
  isConnecting?: boolean;
}

export const GitHubConnectCard: React.FC<GitHubConnectCardProps> = ({
  account,
  onConnect,
  onDisconnect,
  onViewDetails,
  isConnecting = false,
}) => {
  const [showOAuthStatus, setShowOAuthStatus] = useState(false);

  const isConnected = account && account.status === 'Connected';
  const formattedDate = account?.connectedAt
    ? new Date(account.connectedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Not Connected';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100">
            <Github size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">GitHub</h3>
            <p className="text-xs text-slate-400">Official Web Application OAuth 2.0</p>
          </div>
        </div>

        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              isConnected
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Account Details if Connected */}
      {isConnected && account ? (
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={account.avatar || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150'}
                alt={account.accountName}
                className="w-10 h-10 rounded-lg object-cover border border-slate-700"
              />
              <div>
                <div className="font-bold text-slate-200 text-sm">{account.accountName}</div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1 font-mono">
                  @{account.username || account.accountId}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewDetails && onViewDetails(account)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
            >
              <ExternalLink size={12} />
              <span>Details</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Last Connected
              </span>
              <span className="text-slate-300 font-medium">{formattedDate}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                <GitFork size={10} className="text-indigo-400" />
                Repositories
              </span>
              <span className="text-slate-200 font-bold font-mono">
                {account.repositoriesCount !== undefined ? account.repositoriesCount : 'N/A'} repos
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOAuthStatus(!showOAuthStatus)}
            className="w-full pt-1.5 flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1 font-semibold text-indigo-400">
              <ShieldCheck size={13} />
              OAuth Security Status
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {showOAuthStatus ? 'Hide ▲' : 'Show ▼'}
            </span>
          </button>

          {showOAuthStatus && (
            <OAuthStatus
              status={account.status as any}
              accessToken={account.accessToken}
              tokenExpiry={account.tokenExpiry}
              permissions={account.permissions}
              onRenewToken={onConnect}
            />
          )}
        </div>
      ) : (
        <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5 text-xs text-slate-400 space-y-2">
          <p className="leading-relaxed">
            Link your GitHub organization or developer account to integrate repository updates, technical developer posts, and release announcements.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-500" /> Read:User Scopes
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-500" /> Repo Access
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-2">
        {isConnected && account ? (
          <>
            <button
              type="button"
              onClick={onConnect}
              disabled={isConnecting}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={13} className={isConnecting ? 'animate-spin' : ''} />
              <span>Re-authorize</span>
            </button>

            <button
              type="button"
              onClick={() => onDisconnect(account.id)}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Unlink size={13} />
              <span>Disconnect</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            {isConnecting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Connecting GitHub...</span>
              </>
            ) : (
              <>
                <Github size={15} />
                <span>Connect GitHub Account</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
