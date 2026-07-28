import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { SocialPlatform } from '../../social/types';
import { platformService } from '../../services/social/platform.service';
import { socialService } from '../../services/social/social.service';
import { PlatformIcon } from './PlatformIcon';

interface ConnectModalProps {
  onClose: () => void;
  onConnected: () => void;
  initialPlatform?: SocialPlatform;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  onClose,
  onConnected,
  initialPlatform = 'facebook',
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(initialPlatform);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supportedPlatforms = platformService.getSupportedPlatforms();
  const currentConfig = platformService.getAdapter(selectedPlatform).getConfig();

  const handleStartOAuth = () => {
    setStep(2);
  };

  const handleApprovePermissions = () => {
    setStep(3);
  };

  const handleSimulateOAuthCallback = async () => {
    try {
      setIsProcessing(true);
      setErrorMsg(null);

      // Simulate official code exchange
      const authCode = `auth_code_${selectedPlatform}_${Math.random().toString(36).substring(2, 10)}`;
      await socialService.connectAccount(
        selectedPlatform,
        authCode,
        'http://localhost:3000/oauth/callback'
      );

      setStep(4);
      setTimeout(() => {
        onConnected();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'OAuth Connection failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 md:p-8 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
              Step {step} of 4
            </span>
            <h3 className="font-extrabold text-slate-100 text-base mt-1">
              Social Account Connection Flow
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full ${step >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
        </div>

        {/* STEP 1: Select Platform */}
        {step === 1 && (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-slate-400">
              Select an official social media platform to initiate OAuth authorization and connect your brand account.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {supportedPlatforms.map((p) => {
                const isSelected = selectedPlatform === p.platform;
                return (
                  <button
                    key={p.platform}
                    type="button"
                    onClick={() => setSelectedPlatform(p.platform)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <PlatformIcon platform={p.platform} size="md" />
                    <div>
                      <div className="font-bold text-xs text-slate-100">{p.displayName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">OAuth 2.0 API</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartOAuth}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Continue to Permissions</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Review Permissions */}
        {step === 2 && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <PlatformIcon platform={selectedPlatform} size="md" />
              <div>
                <h4 className="font-bold text-xs text-slate-100">{currentConfig.displayName}</h4>
                <p className="text-[11px] text-slate-400">Review OAuth scopes required by the application</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Required Platform Scopes:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {currentConfig.scopes.map((sc) => (
                  <div
                    key={sc}
                    className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2 text-xs"
                  >
                    <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                    <code className="text-indigo-300 font-mono text-[11px]">{sc}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleApprovePermissions}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Approve & Authorize</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OAuth Authorization Flow */}
        {step === 3 && (
          <div className="mt-5 space-y-4">
            <div className="text-center p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Globe size={24} className="animate-spin" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-100">
                Authorizing with {currentConfig.displayName}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Receiving authorization code from official OAuth provider and performing token exchange.
              </p>

              {errorMsg && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center justify-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Back
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulateOAuthCallback}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Globe size={14} className="animate-spin" />
                    <span>Exchanging Token...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Complete OAuth Grant</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Connected Success */}
        {step === 4 && (
          <div className="mt-5 text-center p-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="font-extrabold text-base text-slate-100">
              Account Connected Successfully!
            </h4>
            <p className="text-xs text-slate-400">
              OAuth tokens and account credentials saved securely in local IndexedDB storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
