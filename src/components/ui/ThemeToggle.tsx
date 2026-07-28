import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, Theme } from './ThemeProvider';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="h-3.5 w-3.5" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="h-3.5 w-3.5" /> },
    { id: 'system', label: 'System', icon: <Monitor className="h-3.5 w-3.5" /> },
  ];

  return (
    <div
      className={`inline-flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 ${className}`}
      role="group"
      aria-label="Theme selection"
    >
      {themes.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={`Switch to ${t.label} theme`}
            aria-pressed={isActive}
          >
            {t.icon}
            <span className="hidden sm:inline text-[11px]">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
