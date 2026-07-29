import React from 'react';
import { useSocialAccounts } from './SocialAccountContext';
import { Users, CheckCircle2, Unplug, Clock, AlertTriangle } from 'lucide-react';

export const OverviewCards: React.FC = () => {
  const { stats, setStatusFilter, statusFilter } = useSocialAccounts();

  const cards = [
    {
      id: 'total',
      title: 'Total Connected',
      value: stats.totalAccounts,
      icon: Users,
      color: 'indigo',
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
      filter: 'All',
    },
    {
      id: 'active',
      title: 'Active Accounts',
      value: stats.activeAccounts,
      icon: CheckCircle2,
      color: 'emerald',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      filter: 'Connected',
    },
    {
      id: 'disconnected',
      title: 'Disconnected',
      value: stats.disconnectedAccounts,
      icon: Unplug,
      color: 'slate',
      border: 'border-slate-700',
      bg: 'bg-slate-800/80',
      textColor: 'text-slate-400',
      filter: 'Disconnected',
    },
    {
      id: 'expiring',
      title: 'Expiring Tokens',
      value: stats.expiringTokens,
      icon: Clock,
      color: 'amber',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      filter: 'Needs Attention',
    },
    {
      id: 'errors',
      title: 'Connection Errors',
      value: stats.connectionErrors,
      icon: AlertTriangle,
      color: 'rose',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      textColor: 'text-rose-400',
      filter: 'Needs Attention',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActiveFilter = statusFilter === card.filter;

        return (
          <button
            key={card.id}
            onClick={() => setStatusFilter(card.filter)}
            className={`p-4 rounded-xl border transition-all text-left cursor-pointer group hover:scale-[1.02] ${
              isActiveFilter
                ? `${card.border} ${card.bg} ring-2 ring-indigo-500/50 shadow-lg`
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg} ${card.textColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">{card.value}</div>
          </button>
        );
      })}
    </div>
  );
};
