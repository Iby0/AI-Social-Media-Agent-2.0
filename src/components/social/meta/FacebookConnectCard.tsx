import React, { useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Lock,
  Layers,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Users,
} from 'lucide-react';
import { SocialAccountRecord } from '../../../database/types';
import { FacebookPageSelectOption } from '../../../social/adapters/facebook/facebook.types';
import { MetaFacebookService } from '../../../services/social/meta/facebook.service';
import { socialService } from '../../../services/social/social.service';
import { PlatformIcon } from '../PlatformIcon';
import { ConnectionStatus } from './ConnectionStatus';
import { PermissionStatus } from './PermissionStatus';
import { AccountSelector } from './AccountSelector';
import { DisconnectButton } from '../DisconnectButton';

interface FacebookConnectCardProps {
  connectedAccount?: SocialAccountRecord;
  onRefreshList: () => void;
}

export const FacebookConnectCard: React.FC<FacebookConnectCardProps> = ({
  connectedAccount,
  onRefreshList,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [availablePages, setAvailablePages] = useState<FacebookPageSelectOption[]>([]);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleStartFacebookOAuth = async () => {
    try {
      setIsConnecting(true);
      // Fetch user Facebook Pages
      const userToken = connectedAccount?.accessToken || `EAAB_temp_user_token_${Date.now()}`;
      const pages = await MetaFacebookService.fetchPages(userToken);
      setAvailablePages(pages);
      setShowSelector(true);
    } catch (e) {
      console.error('Facebook page fetch error:', e);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectPage = async (page: FacebookPageSelectOption) => {
    try {
      setIsConnecting(true);
      await MetaFacebookService.connectPage(page);
      onRefreshList();
    } catch (e) {
      console.error('Connect page error:', e);
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
            <PlatformIcon platform="facebook" size="lg" />
            <div>
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-1.5">
                Facebook Page Integration
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
                src={connectedAccount.avatar || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150'}
                alt={connectedAccount.accountName}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <div className="font-bold text-slate-100 text-xs">{connectedAccount.accountName}</div>
                <div className="text-[11px] text-slate-400">
                  Page ID: <code className="text-indigo-300 font-mono">{connectedAccount.accountId}</code>
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
                <span>{connectedAccount.permissions?.length || 4} scopes</span>
                <ShieldCheck size={13} />
              </button>
            </div>

            {showPermissions && (
              <div className="pt-2">
                <PermissionStatus
                  grantedScopes={connectedAccount.permissions || []}
                  requiredScopes={['pages_show_list', 'pages_read_engagement', 'pages_manage_posts', 'public_profile']}
                  platformName="Facebook Page"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed">
            Connect your official Facebook Page to enable Graph API publishing, page engagement insights, and automated post distribution.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
        {connectedAccount ? (
          <>
            <button
              type="button"
              onClick={handleStartFacebookOAuth}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Switch Page</span>
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
            onClick={handleStartFacebookOAuth}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            {isConnecting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Connecting Facebook...</span>
              </>
            ) : (
              <>
                <ArrowRight size={14} />
                <span>Connect Facebook Page</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Page Selector Modal */}
      {showSelector && (
        <AccountSelector
          platform="facebook"
          facebookPages={availablePages}
          onSelectFacebookPage={handleSelectPage}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
};
