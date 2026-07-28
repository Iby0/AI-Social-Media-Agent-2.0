import React from 'react';
import { Sparkles, Database, ShieldCheck, RefreshCw, Cpu, Layers } from 'lucide-react';
import { Post, SocialChannel } from '../types';

interface HeaderProps {
  channels: SocialChannel[];
  posts: Post[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefreshData: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  channels,
  posts,
  activeTab,
  setActiveTab,
  onRefreshData,
  isSyncing,
}) => {
  const activeChannelsCount = channels.filter((c) => c.isConnected && c.status === 'active').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
          <Sparkles className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              AI Social Media Agent
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Clean Architecture • Multi-Channel • IndexedDB Engine
          </p>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="flex items-center gap-3 sm:gap-6 text-xs text-slate-300">
        <button
          onClick={() => setActiveTab('channels')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
          title="Click to manage channels"
        >
          <span className={`h-2 w-2 rounded-full ${activeChannelsCount > 0 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          <span className="font-semibold text-slate-200">{activeChannelsCount}/4</span> Channels
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer hidden md:flex"
        >
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">{scheduledCount}</span> Scheduled
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hidden lg:flex">
          <Database className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">IndexedDB Ready</span>
        </div>

        <button
          onClick={onRefreshData}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New AI Post</span>
        </button>
      </div>
    </header>
  );
};
