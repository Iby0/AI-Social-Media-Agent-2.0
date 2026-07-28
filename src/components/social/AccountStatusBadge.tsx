import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, PauseCircle } from 'lucide-react';
import { SocialAccountStatus } from '../../social/types';

interface AccountStatusBadgeProps {
  status: SocialAccountStatus | string;
  className?: string;
  showDetails?: boolean;
}

export const AccountStatusBadge: React.FC<AccountStatusBadgeProps> = ({
  status,
  className = '',
  showDetails = false,
}) => {
  const normStatus = (status || 'Disconnected').toLowerCase();

  let badgeColor = 'bg-slate-500/10 text-slate-400 border-slate-700';
  let Icon = PauseCircle;
  let label = 'Disconnected';
  let explanation = 'Account is unlinked and OAuth tokens are revoked.';

  if (normStatus === 'connected') {
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    Icon = CheckCircle2;
    label = 'Connected';
    explanation = 'Active OAuth connection with verified access tokens & granted permissions.';
  } else if (normStatus === 'expired') {
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    Icon = Clock;
    label = 'Expired';
    explanation = 'Access token window lapsed. Re-authorization or token refresh required.';
  } else if (normStatus === 'error') {
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    Icon = XCircle;
    label = 'Error';
    explanation = 'Authentication failure or permissions revoked by social platform.';
  } else if (normStatus === 'pending') {
    badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    Icon = AlertTriangle;
    label = 'Pending';
    explanation = 'OAuth authorization flow initiated, awaiting user approval or callback.';
  }

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${badgeColor}`}
        title={explanation}
      >
        <Icon size={13} className={normStatus === 'pending' ? 'animate-pulse' : ''} />
        <span>{label}</span>
      </span>

      {showDetails && (
        <p className="text-[11px] text-slate-400 mt-1 max-w-xs">{explanation}</p>
      )}
    </div>
  );
};
