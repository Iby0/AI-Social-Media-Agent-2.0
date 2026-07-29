import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, Calendar, Mail, GitFork, UserCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { SocialAccountRecord } from '../../database/types';
import { PlatformIcon } from './PlatformIcon';
import { tokenService } from '../../services/social/token.service';

interface SocialAccountDetailsProps {
  account: SocialAccountRecord;
  onClose: () => void;
}

export const SocialAccountDetails: React.FC<SocialAccountDetailsProps> = ({ account, onClose }) => {
  const [showFullToken, setShowFullToken] = useState(false);

  const formattedDate = account.connectedAt
    ? new Date(account.connectedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown';

  const expiryDateFormatted = account.tokenExpiry
    ? new Date(account.tokenExpiry).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Never';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={account.platform} size="lg" />
            <div>
              <h3 className="font-extrabold text-slate-100 text-sm capitalize">
                {account.platform} Account Connection Details
              </h3>
              <p className="text-xs text-slate-400">
                IndexedDB Persisted Record • ID: <code className="text-indigo-300 font-mono">{account.id}</code>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={account.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={account.accountName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <div className="font-bold text-sm text-slate-100">{account.accountName}</div>
              <div className="text-xs text-slate-400">@{account.username || account.accountId}</div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                account.status === 'Connected'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
              }`}
            >
              {account.status}
            </span>
            <div className="text-[10px] text-slate-400">Connected {formattedDate}</div>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {account.email && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                <Mail size={13} className="text-indigo-400" />
                Email Address
              </span>
              <div className="text-slate-200 font-medium truncate">{account.email}</div>
            </div>
          )}

          {account.repositoriesCount !== undefined && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                <GitFork size={13} className="text-indigo-400" />
                Public Repositories
              </span>
              <div className="text-slate-200 font-bold font-mono">{account.repositoriesCount} repos</div>
            </div>
          )}

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <UserCheck size={13} className="text-indigo-400" />
              Platform Account ID
            </span>
            <div className="text-slate-200 font-mono text-[11px] truncate">{account.accountId}</div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <Calendar size={13} className="text-indigo-400" />
              Token Expiration Date
            </span>
            <div className="text-slate-200 font-medium">{expiryDateFormatted}</div>
          </div>
        </div>

        {/* Scopes & Permissions */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Authorized Scopes
            </span>
            <span className="text-[10px] text-indigo-300 font-mono">
              {account.permissions?.length || 0} permissions
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {(account.permissions || ['read_profile']).map((perm) => (
              <span
                key={perm}
                className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono rounded"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        {/* Token Security Panel */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <KeyRound size={14} className="text-amber-400" />
              Access Token Security View
            </span>
            <button
              type="button"
              onClick={() => setShowFullToken(!showFullToken)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              {showFullToken ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{showFullToken ? 'Mask Token' : 'Reveal Raw'}</span>
            </button>
          </div>

          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 break-all select-all">
            {showFullToken
              ? account.accessToken || 'No Access Token'
              : tokenService.maskToken(account.accessToken)}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
