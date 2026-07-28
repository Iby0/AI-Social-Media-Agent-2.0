import React, { useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Info,
  Users,
  ArrowRight,
  HelpCircle,
  Instagram,
  Sparkles,
} from 'lucide-react';
import { SocialAccountRecord } from '../../../database/types';
import { InstagramBusinessSelectOption } from '../../../social/adapters/instagram/instagram.types';
import { MetaInstagramService } from '../../../services/social/meta/instagram.service';
import { socialService } from '../../../services/social/social.service';
import { PlatformIcon } from '../PlatformIcon';
import { ConnectionStatus } from './ConnectionStatus';
import { PermissionStatus } from './PermissionStatus';
import { AccountSelector } from './AccountSelector';
import { DisconnectButton } from '../DisconnectButton';

interface InstagramConnectCardProps {
  connectedAccount?: SocialAccountRecord;
  onRefreshList: () => void;
}

export const InstagramConnectCard: React.FC<InstagramConnectCardProps> = ({
  connectedAccount,
  onRefreshList,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState<InstagramBusinessSelectOption[]>([]);
  const [showRequirementInfo, setShowRequirementInfo] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const requirementData = MetaInstagramService.getInstagramRequirementExplanation();

  const handleStartInstagramOAuth = async () => {
    try {
      setIsConnecting(true);
      const userToken = connectedAccount?.accessToken || `EAAI_temp_user_token_${Date.now()}`;
      const accounts = await MetaInstagramService.fetchConnectedAccounts(userToken);
      setAvailableAccounts(accounts);
      setShowSelector(true);
    } catch (e) {
      console.error('Instagram accounts fetch error:', e);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectAccount = async (option: InstagramBusinessSelectOption) => {
    try {
      setIsConnecting(true);
      await MetaInstagramService.connectInstagramAccount(option);
      onRefreshList();
    } catch (e) {
      console.error('Connect Instagram account error:', e);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (connectedAccount) {
      await socialService.disconnectAccount(connectedAccount.id);
      onRefreshList();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <PlatformIcon platform="instagram" size="lg" />
            <div>
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-1.5">
                Instagram Business Account
              </h3>
              <span className="text-[11px] text-slate-400">Meta Graph API v18.0</span>
            </div>
          </div>

          <ConnectionStatus
            status={connectedAccount ? connectedAccount.status : 'Disconnected'}
            tokenExpiry={connectedAccount?.tokenExpiry}
            onRefresh={onRefreshList}
          />
        </div>

        {/* Connection Details or Prompt */}
        {connectedAccount ? (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={connectedAccount.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}
                alt={connectedAccount.accountName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="font-bold text-slate-100 text-xs">@{connectedAccount.accountName}</div>
                <div className="text-[11px] text-slate-400">
                  Instagram ID: <code className="text-indigo-300 font-mono">{connectedAccount.accountId}</code>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Granted Scopes:</span>
              <button
                type="button"
                onClick={() => setShowPermissions(!showPermissions)}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>{connectedAccount.permissions?.length || 5} scopes</span>
                <ShieldCheck size={13} />
              </button>
            </div>

            {showPermissions && (
              <div className="pt-2">
                <PermissionStatus
                  grantedScopes={connectedAccount.permissions || []}
                  requiredScopes={[
                    'instagram_basic',
                    'instagram_content_publish',
                    'instagram_manage_comments',
                    'pages_show_list',
                  ]}
                  platformName="Instagram Business"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your Instagram Professional (Business or Creator) account to manage media posts, comments, and follower metrics.
            </p>

            <button
              type="button"
              onClick={() => setShowRequirementInfo(!showRequirementInfo)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <HelpCircle size={13} />
              <span>{showRequirementInfo ? 'Hide Requirements' : 'Why Facebook Page Connection is Required'}</span>
            </button>

            {showRequirementInfo && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2 text-[11px] text-indigo-200">
                <div className="font-bold text-indigo-300">{requirementData.title}</div>
                <p className="text-indigo-200/90 leading-relaxed">{requirementData.explanation}</p>
                <div className="space-y-1 pt-1 border-t border-indigo-500/20 text-indigo-300/80">
                  {requirementData.steps.map((st) => (
                    <div key={st}>{st}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
        {connectedAccount ? (
          <>
            <button
              type="button"
              onClick={handleStartInstagramOAuth}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Switch Account</span>
            </button>

            <DisconnectButton
              accountName={connectedAccount.accountName}
              onConfirm={handleDisconnect}
            />
          </>
        ) : (
          <button
            type="button"
            disabled={isConnecting}
            onClick={handleStartInstagramOAuth}
            className="w-full py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all"
          >
            {isConnecting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Finding Instagram Account...</span>
              </>
            ) : (
              <>
                <ArrowRight size={14} />
                <span>Connect Instagram Business</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Account Selector Modal */}
      {showSelector && (
        <AccountSelector
          platform="instagram"
          instagramAccounts={availableAccounts}
          onSelectInstagramAccount={handleSelectAccount}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
};
