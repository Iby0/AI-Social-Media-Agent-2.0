import React from 'react';
import { Drawer } from '../ui/Drawer';
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
  X,
  Layers,
  HardDrive,
  FileText,
} from 'lucide-react';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  draftCount?: number;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  draftCount = 0,
}) => {
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

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Navigation Menu" position="left" size="sm">
      <div className="space-y-2 py-2">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">AI Studio Mobile</h4>
            <p className="text-[10px] text-slate-400">Control Panel Navigation</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </Drawer>
  );
};
