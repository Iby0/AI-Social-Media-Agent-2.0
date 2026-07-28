import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

export interface QuickActionCardProps {
  id?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  buttonText?: string;
  color?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'purple';
  badge?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  onClick,
  buttonText = 'Action',
  color = 'indigo',
  badge,
}) => {
  const colorMap = {
    indigo: 'from-indigo-600/20 to-blue-600/10 hover:from-indigo-600/30 hover:to-blue-600/20 border-indigo-500/30 text-indigo-400',
    emerald: 'from-emerald-600/20 to-teal-600/10 hover:from-emerald-600/30 hover:to-teal-600/20 border-emerald-500/30 text-emerald-400',
    cyan: 'from-cyan-600/20 to-blue-600/10 hover:from-cyan-600/30 hover:to-blue-600/20 border-cyan-500/30 text-cyan-400',
    amber: 'from-amber-600/20 to-orange-600/10 hover:from-amber-600/30 hover:to-orange-600/20 border-amber-500/30 text-amber-400',
    rose: 'from-rose-600/20 to-red-600/10 hover:from-rose-600/30 hover:to-red-600/20 border-rose-500/30 text-rose-400',
    purple: 'from-purple-600/20 to-indigo-600/10 hover:from-purple-600/30 hover:to-indigo-600/20 border-purple-500/30 text-purple-400',
  };

  const styleClass = colorMap[color] || colorMap.indigo;

  return (
    <div
      id={id || `quick-action-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative p-5 rounded-2xl bg-gradient-to-br border transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between ${styleClass}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-current shadow-md">
            <Icon className="h-5 w-5" />
          </div>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-900/80 text-white border border-slate-700">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white">
        <span>{buttonText}</span>
        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
