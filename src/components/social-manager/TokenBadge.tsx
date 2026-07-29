import React from 'react';
import { TokenState } from '../../database/types';
import { KeyRound, Clock, AlertTriangle, RefreshCw, Unplug } from 'lucide-react';

export interface TokenBadgeProps {
  tokenState?: TokenState;
  daysRemaining?: number;
  size?: 'sm' | 'md';
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({
  tokenState = 'Valid',
  daysRemaining,
  size = 'md',
}) => {
  const getConfig = () => {
    switch (tokenState) {
      case 'Valid':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: KeyRound,
          label: daysRemaining !== undefined ? `Valid (${daysRemaining}d)` : 'Valid Token',
        };
      case 'Expiring Soon':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: Clock,
          label: daysRemaining !== undefined ? `Expiring (${daysRemaining}d)` : 'Expiring Soon',
        };
      case 'Expired':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: AlertTriangle,
          label: 'Expired',
        };
      case 'Refresh Required':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          icon: RefreshCw,
          label: 'Refresh Required',
        };
      case 'Disconnected':
      default:
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-400',
          icon: Unplug,
          label: 'Disconnected',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-lg border ${config.bg} ${sizeClass}`}>
      <Icon className="h-3 w-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
