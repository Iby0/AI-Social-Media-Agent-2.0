import React from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useThemeSettings } from '../../hooks/useThemeSettings';
import { ThemeOption } from '../../database/types';

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useThemeSettings();

  const themes: { id: ThemeOption; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'light',
      label: 'Light Mode',
      desc: 'Clean, crisp white interface with high-contrast text',
      icon: Sun,
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      desc: 'Eye-friendly dark canvas ideal for low-light environments',
      icon: Moon,
    },
    {
      id: 'system',
      label: 'System Default',
      desc: 'Automatically syncs with your operating system appearance',
      icon: Monitor,
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-400" />
            Appearance & Visual Theme
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred color theme or match your system settings automatically.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
          Current: <strong className="text-indigo-400 capitalize">{resolvedTheme}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((t) => {
          const Icon = t.icon;
          const isSelected = theme === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}

              <div>
                <div className={`p-2.5 rounded-lg w-fit mb-3 ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{t.label}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
