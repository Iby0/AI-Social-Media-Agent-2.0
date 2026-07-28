import React, { useState } from 'react';
import {
  KeyRound,
  RefreshCw,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { SocialAccountRecord } from '../../database/types';
import { tokenService } from '../../services/social/token.service';
import { socialService } from '../../services/social/social.service';
import { PlatformIcon } from './PlatformIcon';
import { AccountStatusBadge } from './AccountStatusBadge';
import { DisconnectButton } from './DisconnectButton';
import { TokenInspectorModal } from './TokenInspectorModal';

interface SocialAccountCardProps {
  account: SocialAccountRecord;
  onRefreshList: () => void;
}

export const SocialAccountCard: React.FC<SocialAccountCardProps> = ({
  account,
  onRefreshList,
}) => {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ isValid: boolean; message: string } | null>(null);

  const expiryInfo = tokenService.getTimeToExpiry(account.tokenExpiry);
  const maskedToken = tokenService.maskToken(account.accessToken);

  const handleDisconnect = async () => {
    await socialService.disconnectAccount(account.id);
    onRefreshList();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await socialService.testConnection(account.id);
      setTestResult(res);
      setTimeout(() => setTestResult(null), 4000);
    } catch (err: any) {
      setTestResult({ isValid: false, message: err?.message || 'Test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsTesting(true);
    try {
      await socialService.refreshAccountToken(account.id);
      onRefreshList();
      setTestResult({ isValid: true, message: 'Token refreshed!' });
      setTimeout(() => setTestResult(null), 3000);
    } catch (err: any) {
      setTestResult({ isValid: false, message: 'Refresh failed' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Bar: Icon, Name & Status */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <PlatformIcon platform={account.platform} size="lg" />
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-100 text-sm truncate tracking-tight">
                {account.accountName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span className="capitalize">{account.platform}</span>
                <span>•</span>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                  {account.accountId}
                </span>
              </div>
            </div>
          </div>

          <AccountStatusBadge status={account.status} />
        </div>

        {/* Token Architecture Bar */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Lock size={12} className="text-indigo-400" />
              Token Hash:
            </span>
            <span className="font-mono text-indigo-300 font-semibold">{maskedToken}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/60">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Clock size={12} className="text-amber-400" />
              Expiry:
            </span>
            <span
              className={`font-semibold ${
                expiryInfo.isExpired ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {expiryInfo.formatted}
            </span>
          </div>
        </div>

        {/* Diagnostic Output Banner */}
        {testResult && (
          <div
            className={`p-2.5 rounded-xl border text-xs mb-3 flex items-center gap-2 ${
              testResult.isValid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <Activity size={14} className="shrink-0" />
            <span className="truncate">{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Bottom Bar: Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsInspectorOpen(true)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
            title="Inspect Token Architecture"
          >
            <KeyRound size={15} />
          </button>

          <button
            type="button"
            disabled={isTesting}
            onClick={handleTestConnection}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
            title="Test Token Health"
          >
            <Activity size={15} className={isTesting ? 'animate-pulse text-indigo-400' : ''} />
          </button>

          {account.status === 'Expired' && (
            <button
              type="button"
              disabled={isTesting}
              onClick={handleRefreshToken}
              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={13} className={isTesting ? 'animate-spin' : ''} />
              <span>Renew</span>
            </button>
          )}
        </div>

        <DisconnectButton onConfirm={handleDisconnect} accountName={account.accountName} />
      </div>

      {/* Token Inspector Modal */}
      {isInspectorOpen && (
        <TokenInspectorModal
          account={account}
          onClose={() => setIsInspectorOpen(false)}
          onAccountUpdated={onRefreshList}
        />
      )}
    </div>
  );
};
