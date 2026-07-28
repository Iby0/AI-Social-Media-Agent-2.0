import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  badge?: string;
  color?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  icon: Icon,
  change,
  changeType = 'positive',
  description,
  badge,
  color = 'indigo',
  onClick,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      text: 'text-indigo-400',
      glow: 'shadow-indigo-500/10',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/10',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/10',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/10',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/10',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      id={id || `stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative group p-5 rounded-2xl bg-slate-900 border transition-all duration-200 shadow-xl ${
        scheme.border
      } ${scheme.glow} ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
            {badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} border border-current/20 shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(change || description) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                changeType === 'positive'
                  ? 'text-emerald-400'
                  : changeType === 'negative'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {changeType === 'positive' && <ArrowUpRight className="h-3.5 w-3.5" />}
              {changeType === 'negative' && <ArrowDownRight className="h-3.5 w-3.5" />}
              {changeType === 'neutral' && <Minus className="h-3.5 w-3.5" />}
              {change}
            </span>
          )}
          {description && <span className="text-slate-500 text-[11px] font-medium">{description}</span>}
        </div>
      )}
    </div>
  );
};
