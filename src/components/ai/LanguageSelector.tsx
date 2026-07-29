import React from 'react';
import { SupportedLanguage } from '../../types/ai';
import { Languages, Check } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
}

export const LANGUAGES: { id: SupportedLanguage; label: string; native: string; flag: string; badge?: string }[] = [
  { id: 'English', label: 'English', native: 'English', flag: '🇺🇸' },
  { id: 'Bangla', label: 'Bangla', native: 'বাংলা', flag: '🇧🇩', badge: 'Native Script' },
  { id: 'Mixed Bengali + English', label: 'Mixed (Banglish)', native: 'বাংলা + English', flag: '🇧🇩/🇺🇸', badge: 'High Engagement' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <Languages className="h-3.5 w-3.5 text-indigo-400" />
        <span>Output Language</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.id;

          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => onChange(lang.id)}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500/40 font-bold'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span>{lang.flag}</span>
                  <span className="text-white">{lang.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">{lang.native}</span>
              </div>

              {isSelected && <Check className="h-4 w-4 text-indigo-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
