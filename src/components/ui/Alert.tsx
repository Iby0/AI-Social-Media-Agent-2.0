import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const typeStyles = {
    info: {
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200',
      icon: <Info className="h-4 w-4 text-cyan-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
      icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-200',
      icon: <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />,
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${style.bg} ${className}`}
      role="alert"
    >
      <div className="mt-0.5">{style.icon}</div>

      <div className="flex-1 space-y-0.5">
        {title && <h4 className="text-xs font-bold text-white">{title}</h4>}
        <div className="text-xs opacity-90 leading-relaxed">{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-slate-800/40 cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
