import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  Share2,
  BarChart3,
  History,
  Settings,
  UserCheck,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Layers,
  HardDrive,
  FileText,
} from 'lucide-react';

export interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  draftCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
  draftCount = 0,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Content Library', icon: FileText },
    { id: 'studio', label: 'Content Generator', icon: Sparkles, badge: draftCount > 0 ? `${draftCount}` : undefined },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'calendar', label: 'Scheduler', icon: Calendar },
    { id: 'channels', label: 'Social Accounts', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Activity Logs', icon: History },
    { id: 'storage', label: 'Storage Manager', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle },
  ];

  return (
    <aside
      id="dashboard-sidebar"
      aria-label="Dashboard Sidebar Navigation"
      role="navigation"
      className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 relative select-none z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Top Collapse Toggle Button */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigation
            </span>
          </div>
        )}

        <button
          onClick={handleToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-colors cursor-pointer mx-auto md:mx-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                }`}
              />

              {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

              {!isCollapsed && item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Status */}
      {!isCollapsed && (
        <div className="p-3.5 m-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-indigo-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>AI Studio Engine v2.0</span>
          </div>
          <p className="text-slate-500 leading-tight">All systems operational</p>
        </div>
      )}
    </aside>
  );
};
