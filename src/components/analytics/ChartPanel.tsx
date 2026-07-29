import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { BarChart3, TrendingUp, HardDrive, Sparkles, Workflow } from 'lucide-react';

export const ChartPanel: React.FC = () => {
  const { timeSeries } = useAnalytics();
  const [chartType, setChartType] = useState<'posts' | 'ai' | 'storage' | 'workflow'>('posts');

  const maxPostValue = Math.max(...timeSeries.map((d) => d.posts), 1);
  const maxAiValue = Math.max(...timeSeries.map((d) => d.aiRequests), 1);
  const maxStorageValue = Math.max(...timeSeries.map((d) => d.storageMb), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Activity Trends & Performance Charts</h3>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setChartType('posts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              chartType === 'posts'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Posts Over Time
          </button>
          <button
            type="button"
            onClick={() => setChartType('ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              chartType === 'ai'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            AI Usage
          </button>
          <button
            type="button"
            onClick={() => setChartType('storage')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              chartType === 'storage'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Storage Growth
          </button>
          <button
            type="button"
            onClick={() => setChartType('workflow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              chartType === 'workflow'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Workflow Activity
          </button>
        </div>
      </div>

      {/* Chart Visualizations */}
      <div className="pt-2">
        {chartType === 'posts' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">Daily Post Generation & Dispatch Volume (Last 7 Days)</p>
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-200 px-2">
              {timeSeries.map((item) => {
                const heightPercent = Math.round((item.posts / maxPostValue) * 100);
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-all">
                      {item.posts}
                    </div>
                    <div className="w-full bg-slate-100 h-32 rounded-t-lg flex items-end overflow-hidden">
                      <div
                        className="w-full bg-indigo-600 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.date.substring(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chartType === 'ai' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">Gemini API Invocations & Token Requests (Last 7 Days)</p>
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-200 px-2">
              {timeSeries.map((item) => {
                const heightPercent = Math.round((item.aiRequests / maxAiValue) * 100);
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-all">
                      {item.aiRequests}
                    </div>
                    <div className="w-full bg-slate-100 h-32 rounded-t-lg flex items-end overflow-hidden">
                      <div
                        className="w-full bg-purple-600 rounded-t-lg transition-all duration-500 group-hover:bg-purple-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.date.substring(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chartType === 'storage' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">Local IndexedDB Storage Consumption (MB)</p>
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-200 px-2">
              {timeSeries.map((item) => {
                const heightPercent = Math.round((item.storageMb / maxStorageValue) * 100);
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition-all">
                      {item.storageMb} MB
                    </div>
                    <div className="w-full bg-slate-100 h-32 rounded-t-lg flex items-end overflow-hidden">
                      <div
                        className="w-full bg-teal-600 rounded-t-lg transition-all duration-500 group-hover:bg-teal-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.date.substring(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chartType === 'workflow' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">Published vs Failed Workflow Pipeline Executions</p>
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-200 px-2">
              {timeSeries.map((item) => {
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-all">
                      {item.published} Pub / {item.failures} Err
                    </div>
                    <div className="w-full bg-slate-100 h-32 rounded-t-lg flex flex-col justify-end overflow-hidden gap-0.5">
                      {item.failures > 0 && (
                        <div
                          className="w-full bg-rose-500 rounded-t-sm"
                          style={{ height: `${item.failures * 15}%` }}
                        />
                      )}
                      <div
                        className="w-full bg-emerald-500 rounded-t-sm"
                        style={{ height: `${item.published * 18}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.date.substring(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
