import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle, Clock, X, Lock, RefreshCw, Copy, Check } from 'lucide-react';
import { SocialAccountRecord } from '../../database/types';
import { tokenService } from '../../services/social/token.service';
import { socialService } from '../../services/social/social.service';
import { platformService } from '../../services/social/platform.service';
import { PlatformIcon } from './PlatformIcon';

interface TokenInspectorModalProps {
  account: SocialAccountRecord;
  onClose: () => void;
  onAccountUpdated: () => void;
}

export const TokenInspectorModal: React.FC<TokenInspectorModalProps> = ({
  account,
  onClose,
  onAccountUpdated,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [copiedMasked, setCopiedMasked] = useState(false);

  const expiryInfo = tokenService.getTimeToExpiry(account.tokenExpiry);
  const maskedToken = tokenService.maskToken(account.accessToken);

  let adapterScopes: string[] = [];
  try {
    const adapter = platformService.getAdapter(account.platform as any);
    adapterScopes = adapter.getPermissions();
  } catch {
    adapterScopes = ['read_profile', 'publish_content'];
  }

  const handleTestToken = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await socialService.testConnection(account.id);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ isValid: false, message: err?.message || 'Token test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsTesting(true);
    try {
      await socialService.refreshAccountToken(account.id);
      onAccountUpdated();
      setTestResult({ isValid: true, message: 'Token refreshed and renewed successfully!' });
    } catch (err: any) {
      setTestResult({ isValid: false, message: err?.message || 'Token refresh failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyMasked = () => {
    navigator.clipboard.writeText(maskedToken);
    setCopiedMasked(true);
    setTimeout(() => setCopiedMasked(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 md:p-8 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={account.platform} size="md" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                Token Architecture Inspector
              </h3>
              <p className="text-xs text-slate-400">{account.accountName} • {account.platform}</p>
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

        {/* Security Warning Banner */}
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
          <Lock size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Security Standard Enforced:</span> Raw access tokens are masked using standard platform encryption rules and never rendered plaintext in UI views.
          </div>
        </div>

        {/* Token Details Body */}
        <div className="mt-4 space-y-4 text-xs">
          {/* Masked Access Token */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <KeyRound size={14} className="text-indigo-400" />
                Access Token (Masked)
              </span>
              <button
                type="button"
                onClick={handleCopyMasked}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copiedMasked ? <Check size={12} /> : <Copy size={12} />}
                {copiedMasked ? 'Copied' : 'Copy Representation'}
              </button>
            </div>
            <code className="block bg-slate-900 border border-slate-800 text-indigo-300 font-mono text-xs p-2 rounded-lg break-all">
              {maskedToken}
            </code>
          </div>

          {/* Token Expiry Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
                <Clock size={13} className="text-blue-400" />
                Expiry Window
              </span>
              <div className="font-bold text-slate-200">
                {expiryInfo.formatted}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {account.tokenExpiry
                  ? new Date(account.tokenExpiry).toLocaleDateString()
                  : 'No set expiry'}
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <span className="text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
                <ShieldAlert size={13} className="text-emerald-400" />
                Status Health
              </span>
              <div className={`font-bold ${account.status === 'Connected' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {account.status}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Account ID: {account.accountId}
              </div>
            </div>
          </div>

          {/* Granted OAuth Scopes */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <span className="text-slate-400 block mb-2 font-medium">
              Granted OAuth Scopes & Permissions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {adapterScopes.map((scope) => (
                <span
                  key={scope}
                  className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded text-[11px] font-mono"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>

          {/* Test Diagnostic Output */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                testResult.isValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.isValid ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isTesting}
            onClick={handleRefreshToken}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} className={isTesting ? 'animate-spin' : ''} />
            <span>Refresh Token</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isTesting}
              onClick={handleTestToken}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              {isTesting ? 'Testing...' : 'Test Token Health'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
