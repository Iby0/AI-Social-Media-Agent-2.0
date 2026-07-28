import React from 'react';
import { SidebarNavItem } from './SidebarBase';

export interface MobileMenuProps {
  navItems: SidebarNavItem[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  className?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  navItems,
  activeTab,
  setActiveTab,
  className = '',
}) => {
  return (
    <div
      className={`md:hidden bg-slate-900 border-b border-slate-800 p-2 flex items-center gap-1 overflow-x-auto no-scrollbar select-none ${className}`}
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
