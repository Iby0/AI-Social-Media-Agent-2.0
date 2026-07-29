import React, { useState } from 'react';
import { useAutomation } from '../../hooks/useAutomation';
import { AutomationFrequency, AutomationOutputAction } from '../../types/agent';
import { Sliders, Clock, Moon, Layers, ShieldCheck, Check } from 'lucide-react';
import { PLATFORM_INFO } from '../publishing/PlatformSelector';

export const AutomationSettings: React.FC = () => {
  const { rules, updateRules } = useAutomation();

  const [topicsInput, setTopicsInput] = useState(rules.topics ? rules.topics.join(', ') : '');

  const handleTopicsBlur = () => {
    const list = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    updateRules({ topics: list });
  };

  const togglePlatform = (platformKey: 'facebook' | 'instagram' | 'linkedin' | 'github') => {
    const current = rules.preferredPlatforms || [];
    const exists = current.includes(platformKey);
    const updated = exists ? current.filter((p) => p !== platformKey) : [...current, platformKey];
    updateRules({ preferredPlatforms: updated });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Automation & Rules Engine Settings</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={rules.enabled}
            onChange={(e) => updateRules({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          <span className="ml-2 text-xs font-bold text-slate-700">
            {rules.enabled ? 'Agent Active' : 'Agent Paused'}
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frequency & Mode */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Trigger Frequency</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['daily', 'weekly', 'monthly', 'manual'] as AutomationFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => updateRules({ frequency: freq })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    rules.frequency === freq
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Output Execution Action</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateRules({ outputAction: 'generate_and_queue' })}
                className={`p-3 rounded-xl text-left border transition-all ${
                  rules.outputAction === 'generate_and_queue'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold">Generate & Queue</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Automate post creation + dispatch to publishing queue.</p>
              </button>

              <button
                type="button"
                onClick={() => updateRules({ outputAction: 'draft_only' })}
                className={`p-3 rounded-xl text-left border transition-all ${
                  rules.outputAction === 'draft_only'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-bold">Draft Only</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Save posts to Post Studio for manual review.</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Max Tasks Per Day</label>
            <input
              type="number"
              min={1}
              max={50}
              value={rules.maxDailyTasks}
              onChange={(e) => updateRules({ maxDailyTasks: Number(e.target.value) || 1 })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>
        </div>

        {/* Quiet Hours & Target Platforms */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-600" /> Quiet Hours Window
              </span>
              <input
                type="checkbox"
                checked={rules.quietHoursEnabled}
                onChange={(e) => updateRules({ quietHoursEnabled: e.target.checked })}
                className="rounded text-indigo-600"
              />
            </div>

            {rules.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={rules.quietHoursStart}
                    onChange={(e) => updateRules({ quietHoursStart: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">End Time</label>
                  <input
                    type="time"
                    value={rules.quietHoursEnd}
                    onChange={(e) => updateRules({ quietHoursEnd: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Platforms</label>
            <div className="grid grid-cols-2 gap-2">
              {(['facebook', 'instagram', 'linkedin', 'github'] as const).map((platformKey) => {
                const info = PLATFORM_INFO[platformKey];
                const Icon = info.icon;
                const isSelected = (rules.preferredPlatforms || []).includes(platformKey);

                return (
                  <button
                    key={platformKey}
                    type="button"
                    onClick={() => togglePlatform(platformKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{info.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Auto Content Topics (Comma Separated)</label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              onBlur={handleTopicsBlur}
              placeholder="Cloud Tech, AI Innovations, Social Tips"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
