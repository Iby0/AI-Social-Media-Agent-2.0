import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { PLATFORM_INFO } from '../publishing/PlatformSelector';
import { CheckCircle2, AlertCircle, Share2 } from 'lucide-react';

export const PlatformReport: React.FC = () => {
  const { platformStats } = useAnalytics();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Platform Performance & API Health</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Official Graph & REST APIs
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((p) => {
          const info = PLATFORM_INFO[p.platform];
          const Icon = info.icon;

          return (
            <div
              key={p.platform}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl text-white ${info.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{info.name}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {p.platform}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    p.failures === 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {p.successRate}% Success
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Total Posts</p>
                  <p className="font-bold text-slate-800">{p.totalPosts}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">API Failures</p>
                  <p className={`font-bold ${p.failures > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {p.failures}
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-mono pt-1">
                Last Activity: {new Date(p.lastActivity).toLocaleTimeString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
