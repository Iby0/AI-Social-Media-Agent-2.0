import React from 'react';
import { Languages, Check, Globe } from 'lucide-react';
import { useSettingsContext } from '../../providers/SettingsContext';
import { SUPPORTED_LANGUAGES } from '../../services/settings/settings.utils';
import { LanguageOption } from '../../database/types';

export const LanguageSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsContext();

  const handleSelectLanguage = async (code: LanguageOption) => {
    await updateSettings({ language: code });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Languages className="h-5 w-5 text-sky-400" />
            Language & Regional Format
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Select display language for AI interface and generated post suggestions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = settings.language === lang.code;

          return (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{lang.nativeName}</h4>
                  <p className="text-xs text-slate-400">{lang.name} ({lang.code})</p>
                </div>
              </div>

              {isSelected && (
                <div className="h-5 w-5 rounded-full bg-sky-500 text-white flex items-center justify-center">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Future-ready architecture note */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-3">
        <Globe className="h-4 w-4 text-slate-500 shrink-0" />
        <p className="text-xs text-slate-400">
          <strong>Future Ready i18n Architecture:</strong> Multi-language localization framework is prepared to add Spanish, German, and Hindi translations in upcoming releases.
        </p>
      </div>
    </div>
  );
};
