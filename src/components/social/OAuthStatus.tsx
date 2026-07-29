import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, RefreshCw, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { SocialAccountStatus } from '../../social/types';
import { tokenService } from '../../services/social/token.service';

interface OAuthStatusProps {
  status: SocialAccountStatus;
  accessToken?: string;
  tokenExpiry?: string;
  permissions?: string[];
  onRenewToken?: () => void;
  isRenewing?: boolean;
}

export const OAuthStatus: React.FC<OAuthStatusProps> = ({
  status,
  accessToken,
  tokenExpiry,
  permissions = [],
  onRenewToken,
  isRenewing = false,
}) => {
  const expiryInfo = tokenService.getTimeToExpiry(tokenExpiry);
  const isFormatValid = tokenService.validateTokenFormat(accessToken);
  const maskedToken = tokenService.maskToken(accessToken);

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <KeyRound size={14} className="text-indigo-400" />
          <span className="font-bold text-slate-200">OAuth Token Security Status</span>
        </div>

        <div className="flex items-center gap-1.5">
          {status === 'Connected' && !expiryInfo.isExpired && isFormatValid ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={11} />
              Token Active
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
              <AlertCircle size={11} />
              Action Required
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Clock size={12} className="text-indigo-400" />
            Token Expiry Window
          </span>
          <div className="text-slate-200 font-mono">
            {expiryInfo.isExpired ? (
              <span className="text-rose-400 font-bold">Token Expired</span>
            ) : (
              <span>{expiryInfo.days} days ({expiryInfo.hours} hours) remaining</span>
            )}
          </div>
        </div>

        <div className="p-2 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <ShieldCheck size={12} className="text-indigo-400" />
            Security & Masking
          </span>
          <div className="text-slate-300 font-mono text-[10px] truncate" title={maskedToken}>
            {maskedToken || 'No Token Tokenized'}
          </div>
        </div>
      </div>

      {permissions.length > 0 && (
        <div className="pt-1 text-[11px] flex items-center justify-between text-slate-400">
          <span>Granted Scope Count:</span>
          <span className="font-mono text-indigo-300 font-semibold">{permissions.length} active permissions</span>
        </div>
      )}

      {(status === 'Expired' || expiryInfo.isExpired || !isFormatValid) && onRenewToken && (
        <button
          type="button"
          disabled={isRenewing}
          onClick={onRenewToken}
          className="w-full mt-1 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw size={13} className={isRenewing ? 'animate-spin' : ''} />
          <span>Re-authorize OAuth Token</span>
        </button>
      )}
    </div>
  );
};
