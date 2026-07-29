import React, { useState } from 'react';
import { PublishingProvider, usePublishingContext } from '../../context/PublishingContext';
import { PublishQueue } from './PublishQueue';
import { PublishHistory } from './PublishHistory';
import { RetryPanel } from './RetryPanel';
import { Send, Clock, CheckCircle2, AlertTriangle, RefreshCw, History, ShieldCheck, Zap } from 'lucide-react';

const InnerPublishDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'retry' | 'history'>('queue');
  const { pendingQueue, publishingQueue, publishedItems, failedQueue, retryQueue } = usePublishingContext();

  const totalFailedAndRetry = failedQueue.length + retryQueue.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> 100% Official APIs Only
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Zap className="w-3 h-3" /> Graph & REST Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Official Social Media Publishing Engine</h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Direct REST & Graph API dispatcher for Facebook Pages, Instagram Business, LinkedIn, and GitHub. No browser automation or cookie hacks.
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-4 gap-2 text-center shrink-0 relative z-10">
          <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-2xl min-w-[70px]">
            <p className="text-base font-black text-white">{pendingQueue.length}</p>
            <p className="text-[10px] font-semibold text-slate-400">Pending</p>
          </div>
          <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-2xl min-w-[70px]">
            <p className="text-base font-black text-amber-400">{publishingQueue.length}</p>
            <p className="text-[10px] font-semibold text-amber-300/70">Publishing</p>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-2xl min-w-[70px]">
            <p className="text-base font-black text-emerald-400">{publishedItems.length}</p>
            <p className="text-[10px] font-semibold text-emerald-300/70">Published</p>
          </div>
          <div className="bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-2xl min-w-[70px]">
            <p className="text-base font-black text-rose-400">{totalFailedAndRetry}</p>
            <p className="text-[10px] font-semibold text-rose-300/70">Retry/Failed</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'queue'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Queue & Dispatch</span>
          {pendingQueue.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-800 text-indigo-100">
              {pendingQueue.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('retry')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'retry'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Queue & Failures</span>
          {totalFailedAndRetry > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white">
              {totalFailedAndRetry}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Publish History Audit</span>
          {publishedItems.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200 text-slate-700">
              {publishedItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'queue' && <PublishQueue />}
      {activeTab === 'retry' && <RetryPanel />}
      {activeTab === 'history' && <PublishHistory />}
    </div>
  );
};

export const PublishDashboard: React.FC = () => {
  return (
    <PublishingProvider>
      <InnerPublishDashboard />
    </PublishingProvider>
  );
};
