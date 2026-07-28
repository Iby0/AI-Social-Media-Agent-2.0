import React from 'react';

export interface PageContainerProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-6 max-w-7xl mx-auto w-full ${className}`}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div>
            {title && <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>}
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
