import React from 'react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface SidebarBaseProps {
  navItems: SidebarNavItem[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  className?: string;
}

export const SidebarBase: React.FC<SidebarBaseProps> = ({
  navItems,
  activeTab,
  setActiveTab,
  className = '',
}) => {
  return (
    <aside
      className={`w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 hidden md:flex flex-col justify-between select-none ${className}`}
    >
      <div className="space-y-1">
        <p className="text-[10px] uppercase font-bold text-slate-500 px-3 pb-2 tracking-wider">
          Main Menu
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 px-3">
        <p className="font-semibold text-slate-400">Zero Cost Architecture</p>
        <p className="text-[10px] mt-0.5">IndexedDB • Express • Gemini</p>
      </div>
    </aside>
  );
};
