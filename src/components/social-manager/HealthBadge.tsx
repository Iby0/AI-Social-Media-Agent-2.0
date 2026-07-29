import React from 'react';
import { AccountHealthLevel } from '../../database/types';
import { ShieldCheck, ShieldAlert, ShieldX, Activity, PowerOff } from 'lucide-react';

export interface HealthBadgeProps {
  level?: AccountHealthLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({
  level = 'Good',
  showIcon = true,
  size = 'md',
}) => {
  const getStyles = () => {
    switch (level) {
      case 'Excellent':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: ShieldCheck,
          label: 'Excellent',
        };
      case 'Good':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          dot: 'bg-blue-400',
          icon: Activity,
          label: 'Good',
        };
      case 'Warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400 animate-pulse',
          icon: ShieldAlert,
          label: 'Warning',
        };
      case 'Critical':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400 animate-ping',
          icon: ShieldX,
          label: 'Critical',
        };
      case 'Offline':
      default:
        return {
          bg: 'bg-slate-800/80 border-slate-700 text-slate-400',
          dot: 'bg-slate-500',
          icon: PowerOff,
          label: 'Offline',
        };
    }
  };

  const style = getStyles();
  const Icon = style.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-xs font-semibold gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${style.bg} ${sizeClasses}`}
      title={`Account Health: ${style.label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {showIcon && <Icon className="h-3 w-3 shrink-0" />}
      <span>{style.label}</span>
    </span>
  );
};
