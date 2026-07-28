import React from 'react';

export interface FooterBaseProps {
  version?: string;
  className?: string;
}

export const FooterBase: React.FC<FooterBaseProps> = ({ version = 'v2.0.0', className = '' }) => {
  return (
    <footer className={`bg-slate-900 border-t border-slate-800 px-6 py-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 ${className}`}>
      <div>
        <span>AI Social Media Agent &copy; {new Date().getFullYear()}</span>
        <span className="mx-2 text-slate-700">•</span>
        <span className="text-slate-500">Built with TypeScript, React 19 & Tailwind CSS</span>
      </div>

      <div className="flex items-center gap-4 text-slate-400">
        <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
          {version}
        </span>
      </div>
    </footer>
  );
};
