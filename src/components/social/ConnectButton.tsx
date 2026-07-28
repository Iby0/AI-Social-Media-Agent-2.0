import React from 'react';
import { Link as LinkIcon, Sparkles, Plus } from 'lucide-react';

interface ConnectButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  onClick,
  variant = 'primary',
  size = 'md',
  label = 'Connect Account',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-xs font-semibold rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm font-bold rounded-xl gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/30 transition-all',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all',
    outline:
      'bg-transparent hover:bg-slate-800 text-indigo-400 border border-indigo-500/40 transition-all',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <LinkIcon size={size === 'sm' ? 14 : 16} />
      <span>{label}</span>
    </button>
  );
};
