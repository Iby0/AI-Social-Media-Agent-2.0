import React from 'react';
import { Layers } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
        {icon || <Layers className="h-6 w-6" />}
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {description && <p className="text-xs text-slate-400 leading-relaxed">{description}</p>}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
