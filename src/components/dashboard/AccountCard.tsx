import React from 'react';
import { SocialChannel } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle, Share2, ArrowUpRight } from 'lucide-react';

export interface AccountCardProps {
  channels: SocialChannel[];
  onManageChannels: () => void;
}

const DEFAULT_PLATFORMS = [
  { platform: 'facebook', name: 'Facebook', defaultHandle: '@brandpage' },
  { platform: 'instagram', name: 'Instagram', defaultHandle: '@brand.official' },
  { platform: 'linkedin', name: 'LinkedIn', defaultHandle: 'Company Page' },
  { platform: 'github', name: 'GitHub', defaultHandle: '@org/repo' },
  { platform: 'twitter', name: 'X / Twitter', defaultHandle: '@brand_tweets' },
];

export const AccountCard: React.FC<AccountCardProps> = ({ channels, onManageChannels }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="h-4 w-4 text-indigo-400" />
            <span>Connected Social Accounts</span>
          </h3>
          <p className="text-xs text-slate-400">Platform integration & sync status</p>
        </div>

        <Button variant="ghost" size="xs" onClick={onManageChannels} rightIcon={<ArrowUpRight className="h-3 w-3" />}>
          Manage
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEFAULT_PLATFORMS.map((def) => {
          const match = channels.find((c) => c.platform.toLowerCase() === def.platform.toLowerCase());
          const isConnected = match ? match.isConnected : false;
          const handle = match ? match.handle : def.defaultHandle;

          return (
            <div
              key={def.platform}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                    isConnected ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {def.name.substring(0, 2)}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{def.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{handle}</p>
                </div>
              </div>

              {isConnected ? (
                <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>
                  Connected
                </Badge>
              ) : (
                <Badge variant="neutral" icon={<XCircle className="h-3 w-3" />}>
                  Offline
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
