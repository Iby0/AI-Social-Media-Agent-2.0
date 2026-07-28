import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  Globe,
  User,
  LogOut,
  ShieldCheck,
  Check,
  X,
  Layers,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu } from '../ui/DropdownMenu';
import { Badge } from '../ui/Badge';

export interface DashboardNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu?: () => void;
  onSearchQuery?: (query: string) => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  onSearchQuery,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('EN');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const mockNotifications = [
    { id: 'n1', title: 'Post Published Successfully', time: '5m ago', unread: true },
    { id: 'n2', title: 'Instagram Token Refreshed', time: '1h ago', unread: true },
    { id: 'n3', title: 'Weekly Analytics Report Ready', time: '1d ago', unread: false },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (onSearchQuery) onSearchQuery(q);
  };

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Control Center Dashboard';
      case 'studio':
        return 'AI Content Generator';
      case 'media':
        return 'Media Asset Library';
      case 'calendar':
        return 'Multi-Platform Scheduler';
      case 'channels':
        return 'Social Channel Manager';
      case 'analytics':
        return 'Analytics & Performance';
      case 'logs':
        return 'System Audit Logs';
      case 'settings':
        return 'Workspace Settings & Backup';
      case 'profile':
        return 'User Account Profile';
      case 'help':
        return 'Documentation & Help';
      default:
        return 'Dashboard Control Panel';
    }
  };

  return (
    <header
      id="dashboard-navbar"
      className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Menu Trigger + Brand & Page Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open mobile menu drawer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 md:hidden transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              AI Social Media Studio
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              {getPageTitle(activeTab)}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Live Search Bar UI */}
      <div className="flex-1 max-w-md hidden md:block relative">
        <div className="relative flex items-center">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search posts, templates, channels, logs... (Ctrl+K)"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-950/80 text-xs text-white placeholder-slate-500 pl-9 pr-12 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500 bg-slate-900 rounded border border-slate-800 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Notifications, Theme, Language, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Search Mobile Popover Trigger */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 md:hidden border border-slate-700/80 transition-colors cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notification Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="View notifications"
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-900 animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 space-y-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-indigo-400" />
                  Notifications
                </span>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    {n.unread && (
                      <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Language Selector */}
        <DropdownMenu
          trigger={
            <button
              aria-label="Select Language"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-bold transition-colors cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <span>{selectedLang}</span>
            </button>
          }
          items={[
            {
              id: 'en',
              label: 'English (US)',
              icon: selectedLang === 'EN' ? <Check className="h-3.5 w-3.5 text-indigo-400" /> : undefined,
              onClick: () => setSelectedLang('EN'),
            },
            {
              id: 'es',
              label: 'Español',
              icon: selectedLang === 'ES' ? <Check className="h-3.5 w-3.5 text-indigo-400" /> : undefined,
              onClick: () => setSelectedLang('ES'),
            },
            {
              id: 'fr',
              label: 'Français',
              icon: selectedLang === 'FR' ? <Check className="h-3.5 w-3.5 text-indigo-400" /> : undefined,
              onClick: () => setSelectedLang('FR'),
            },
            {
              id: 'de',
              label: 'Deutsch',
              icon: selectedLang === 'DE' ? <Check className="h-3.5 w-3.5 text-indigo-400" /> : undefined,
              onClick: () => setSelectedLang('DE'),
            },
          ]}
        />

        {/* User Profile & Auth Dropdown */}
        {isAuthenticated && user ? (
          <DropdownMenu
            trigger={
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer">
                <Avatar src={user.avatarUrl} fallback={user.name} size="sm" status="online" />
                <div className="text-left hidden xl:block pr-1">
                  <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">{user.email}</p>
                </div>
              </div>
            }
            items={[
              {
                id: 'profile',
                label: 'User Account Profile',
                icon: <User className="h-4 w-4 text-indigo-400" />,
                onClick: () => setActiveTab('profile'),
              },
              {
                id: 'settings',
                label: 'Workspace Settings',
                icon: <Layers className="h-4 w-4 text-cyan-400" />,
                onClick: () => setActiveTab('settings'),
              },
              {
                id: 'status',
                label: `Auth: ${user.provider.toUpperCase()}`,
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

      {/* Mobile Live Search Modal Overlay */}
      {searchOpen && (
        <div className="absolute top-16 left-0 w-full p-4 bg-slate-900 border-b border-slate-800 md:hidden z-50">
          <div className="relative flex items-center">
            <Search className="h-4 w-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search posts, channels, logs..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              className="w-full bg-slate-950 text-xs text-white pl-9 pr-8 py-2 rounded-xl border border-slate-700"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
