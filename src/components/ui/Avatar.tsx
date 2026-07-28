import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback = 'AI',
  size = 'md',
  status,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
  };

  const statusStyles = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-500',
    busy: 'bg-rose-500',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`rounded-full overflow-hidden bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white border border-slate-700/60 shadow-sm ${sizeStyles[size]}`}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span>{fallback.slice(0, 2).toUpperCase()}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950 ${statusStyles[status]}`}
        />
      )}
    </div>
  );
};
