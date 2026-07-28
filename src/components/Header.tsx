import React from 'react';
import { Sparkles, Database, RefreshCw, Layers, User, LogOut, ShieldCheck } from 'lucide-react';
import { Post, SocialChannel } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from './ui/Avatar';
import { DropdownMenu } from './ui/DropdownMenu';

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
  const { user, isAuthenticated, logout } = useAuth();

  const activeChannelsCount = channels.filter((c) => c.isConnected && c.status === 'active').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 cursor-pointer" onClick={() => setActiveTab('studio')}>
          <Sparkles className="h-5 w-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              AI Social Media Agent
            </h1>
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Autonomous Studio • Multi-Channel • Auth & Session Engine
          </p>
        </div>
      </div>

      {/* Quick Status Bar & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 text-xs text-slate-300">
        <button
          onClick={() => setActiveTab('channels')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
          title="Click to manage channels"
        >
          <span className={`h-2 w-2 rounded-full ${activeChannelsCount > 0 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          <span className="font-semibold text-slate-200">{activeChannelsCount}/4</span> Channels
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer hidden md:flex"
        >
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">{scheduledCount}</span> Scheduled
        </button>

        <button
          onClick={onRefreshData}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>

        {/* User Account Menu / Auth Toggle */}
        {isAuthenticated && user ? (
          <DropdownMenu
            trigger={
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer">
                <Avatar src={user.avatarUrl} fallback={user.name} size="sm" status="online" />
                <div className="text-left hidden lg:block pr-1">
                  <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">{user.email}</p>
                </div>
              </div>
            }
            items={[
              {
                id: 'profile',
                label: 'User Profile & Settings',
                icon: <User className="h-4 w-4 text-indigo-400" />,
                onClick: () => setActiveTab('profile'),
              },
              {
                id: 'verify',
                label: `Provider: ${user.provider.toUpperCase()}`,
                icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />,
                disabled: true,
              },
              {
                id: 'logout',
                label: 'Sign Out Session',
                icon: <LogOut className="h-4 w-4" />,
                danger: true,
                onClick: logout,
              },
            ]}
          />
        ) : (
          <button
            onClick={() => setActiveTab('login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <User className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

