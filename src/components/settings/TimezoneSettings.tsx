import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Globe, Sparkles } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { COMMON_TIMEZONES } from '../../services/settings/settings.utils';
import { DateFormatOption, TimeFormatOption } from '../../database/types';

export const TimezoneSettings: React.FC = () => {
  const { settings, updateSettings, formatDate } = useSettings();
  const [currentTimePreview, setCurrentTimePreview] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimePreview(formatDate(new Date()));
    }, 1000);

    setCurrentTimePreview(formatDate(new Date()));
    return () => clearInterval(timer);
  }, [settings.dateFormat, settings.timeFormat, settings.timezone]);

  const handleTimezoneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await updateSettings({ timezone: e.target.value });
  };

  const handleDateFormatChange = async (fmt: DateFormatOption) => {
    await updateSettings({ dateFormat: fmt });
  };

  const handleTimeFormatChange = async (fmt: TimeFormatOption) => {
    await updateSettings({ timeFormat: fmt });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-400" />
            Timezone & Schedule Format
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure default timezone and date-time presentation for scheduling posts.
          </p>
        </div>
      </div>

      {/* Live Date/Time Preview Box */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <Sparkles className="h-4 w-4" /> Live Formatting Preview
        </div>
        <div className="text-sm font-mono font-bold text-white tracking-wide">
          {currentTimePreview || 'Loading...'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timezone Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-emerald-400" /> User Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={handleTimezoneChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition-all cursor-pointer"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-slate-900 text-white">
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            Posts scheduled in Module 06 will prepare execution timestamps relative to this zone.
          </p>
        </div>

        {/* Time Format */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-emerald-400" /> Time Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['12h', '24h'] as TimeFormatOption[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => handleTimeFormatChange(tf)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  settings.timeFormat === tf
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {tf === '12h' ? '12-Hour (10:30 PM)' : '24-Hour (22:30)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Format Selection */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-emerald-400" /> Date Display Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            [
              { id: 'YYYY-MM-DD', example: '2026-07-28 (ISO Standard)' },
              { id: 'MM/DD/YYYY', example: '07/28/2026 (US Standard)' },
              { id: 'DD/MM/YYYY', example: '28/07/2026 (EU/UK Standard)' },
            ] as { id: DateFormatOption; example: string }[]
          ).map((df) => (
            <button
              key={df.id}
              type="button"
              onClick={() => handleDateFormatChange(df.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                settings.dateFormat === df.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold font-mono text-white mb-0.5">{df.id}</div>
              <div className="text-[11px] text-slate-400">{df.example}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
