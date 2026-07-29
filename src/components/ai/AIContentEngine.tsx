import React, { useState } from 'react';
import { useAIContext } from '../../context/AIContext';
import { PromptForm } from './PromptForm';
import { GeneratedContentCard } from './GeneratedContentCard';
import {
  Sparkles,
  Wand2,
  History,
  Trash2,
  HardDrive,
  Settings,
  Zap,
  Globe,
  Sliders,
  Check,
  Search,
  Filter,
  X,
  RefreshCw,
  Copy,
} from 'lucide-react';

export const AIContentEngine: React.FC = () => {
  const {
    latestOutput,
    currentInput,
    history,
    deleteHistoryItem,
    clearHistory,
    rateLimitStatus,
    settings,
    updateSettings,
    clearCache,
    cachedCount,
    setLatestOutput,
    setCurrentInput,
  } = useAIContext();

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

  const filteredHistory = history.filter((h) => {
    const q = historySearch.toLowerCase();
    return (
      h.feature.toLowerCase().includes(q) ||
      h.platform.toLowerCase().includes(q) ||
      (h.input.topic || '').toLowerCase().includes(q) ||
      (h.output.caption || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header & Engine Health Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">AI Content Generation Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Module 16 Intelligence Layer
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Powered by Google Gemini API with Provider Adapter Architecture & Local Response Cache
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="flex items-center gap-3">
          {/* Daily Quota Counter */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Daily AI Quota
            </span>
            <div className="text-xs font-mono font-bold text-indigo-400">
              {rateLimitStatus.dailyUsed} / {rateLimitStatus.dailyLimit}
            </div>
          </div>

          {/* Cache Counter */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Cached Responses
            </span>
            <div className="text-xs font-mono font-bold text-emerald-400">{cachedCount} items</div>
          </div>

          {/* History Drawer Toggle Button */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <History className="h-4 w-4 text-indigo-400" />
            <span className="hidden sm:inline">History ({history.length})</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            title="AI Engine Settings"
          >
            <Settings className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Form, Right Generated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Prompt Engine */}
        <div className="lg:col-span-5">
          <PromptForm />
        </div>

        {/* Right Panel: Output & Editor */}
        <div className="lg:col-span-7">
          {latestOutput ? (
            <GeneratedContentCard
              output={latestOutput}
              platform={currentInput.platform}
              language={currentInput.language}
            />
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center border border-indigo-500/20">
                <Wand2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">AI Studio Output Canvas</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Configure your topic and target platform on the left, then click "Generate Content" to view platform-optimized captions, hashtags, and visual prompts here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Drawer Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">AI Generation History ({history.length})</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search & Action Bar */}
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950">
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search history..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All History</span>
                </button>
              )}
            </div>

            {/* History List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {filteredHistory.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No AI generation history found.</p>
              ) : (
                filteredHistory.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase font-mono">
                          {item.feature}
                        </span>
                        <span className="text-xs font-semibold text-slate-300">{item.platform}</span>
                        <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setLatestOutput(item.output);
                            setCurrentInput(item.input);
                            setShowHistoryModal(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Load Session
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 font-sans">{item.output.caption}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">AI Engine Configuration</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Cache Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Enable Response Caching</h4>
                  <p className="text-[11px] text-slate-500">Reuse identical prompt results to save quota</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableCache}
                  onChange={(e) => updateSettings({ enableCache: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                />
              </div>

              {/* Cache Clear */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Local Cache ({cachedCount} entries)</h4>
                  <p className="text-[11px] text-slate-500">Purge cached AI responses from local storage</p>
                </div>
                <button
                  onClick={clearCache}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
                >
                  Clear Cache
                </button>
              </div>

              {/* Rate Limits Overview */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white">Rate Limits & Quota</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                  <div>Daily Usage: {rateLimitStatus.dailyUsed}/{rateLimitStatus.dailyLimit}</div>
                  <div>Minute Usage: {rateLimitStatus.minuteUsed}/{rateLimitStatus.minuteLimit}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
