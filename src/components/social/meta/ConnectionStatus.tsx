import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { SocialAccountStatus } from '../../../social/types';

interface ConnectionStatusProps {
  status: SocialAccountStatus;
  tokenExpiry?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  tokenExpiry,
  onRefresh,
  isRefreshing = false,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Connected':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'Expired':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'Error':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Connected':
        return <CheckCircle2 size={13} className="text-emerald-400" />;
      case 'Expired':
        return <Clock size={13} className="text-amber-400" />;
      case 'Error':
        return <AlertTriangle size={13} className="text-rose-400" />;
      default:
        return <Activity size={13} className="text-slate-400" />;
    }
  };

  return (
    <div className="flex items-center justify-between text-xs">
      <div className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{status}</span>
      </div>

      {status === 'Expired' && onRefresh && (
        <button
          type="button"
          disabled={isRefreshing}
          onClick={onRefresh}
          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Renew Token</span>
        </button>
      )}
    </div>
  );
};
