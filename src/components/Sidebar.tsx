import React from 'react';
import {
  Sparkles,
  Calendar,
  Share2,
  BarChart3,
  Bookmark,
  History,
  Settings,
  FileCode2,
  CheckCircle2,
  HardDrive,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  draftCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, draftCount }) => {
  const navItems = [
    { id: 'studio', label: 'AI Content Studio', icon: Sparkles, badge: draftCount > 0 ? `${draftCount} Drafts` : null },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'channels', label: 'Channel Manager', icon: Share2 },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'templates', label: 'Prompt Templates', icon: Bookmark },
    { id: 'profile', label: 'User Profile', icon: UserCheck },
    { id: 'logs', label: 'Activity Audit Log', icon: History },
    { id: 'settings', label: 'Backup & Settings', icon: Settings },
    { id: 'changelog', label: 'v2.0 Changelog', icon: FileCode2 },
  ];

  return (
    <aside id="app-sidebar" className="w-full md:w-64 bg-slate-900 border-r border-slate-800 shrink-0 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Core Operations
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Platforms List Quick Status */}
        <div className="hidden md:block pt-4 border-t border-slate-800">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Supported Official APIs
          </p>
          <div className="space-y-2 px-3 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Facebook Page API
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500" /> Instagram Business API
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" /> LinkedIn API v2
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" /> GitHub REST & GraphQL
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Footer Info */}
      <div className="mt-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-400 space-y-1.5 hidden md:block">
        <div className="flex items-center justify-between text-slate-200 font-medium">
          <span className="flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-indigo-400" /> Storage Engine
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            IndexedDB
          </span>
        </div>
        <p className="text-[11px] leading-tight text-slate-400">
          Client-side IndexedDB database. Optional Supabase cloud backup.
        </p>
      </div>
    </aside>
  );
};
