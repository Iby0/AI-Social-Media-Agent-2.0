import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, FileQuestion } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  type?: 'generic' | 'notFound' | 'network';
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'generic',
  title,
  message,
  onRetry,
  className = '',
}) => {
  const configs = {
    generic: {
      icon: <AlertTriangle className="h-8 w-8 text-amber-400" />,
      defaultTitle: 'Something Went Wrong',
      defaultMsg: 'An unexpected error occurred while processing your request.',
    },
    notFound: {
      icon: <FileQuestion className="h-8 w-8 text-indigo-400" />,
      defaultTitle: '404 — Content Not Found',
      defaultMsg: 'The requested resource or page could not be located.',
    },
    network: {
      icon: <WifiOff className="h-8 w-8 text-rose-400" />,
      defaultTitle: 'Network Connection Lost',
      defaultMsg: 'Please check your internet connection and try again.',
    },
  };

  const config = configs[type];

  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">{config.icon}</div>

      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-bold text-white">{title || config.defaultTitle}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{message || config.defaultMsg}</p>
      </div>

      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
