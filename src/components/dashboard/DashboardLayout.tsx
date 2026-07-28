import React, { useState } from 'react';
import { DashboardNavbar } from './Navbar';
import { DashboardSidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { FooterBase } from '../layout/FooterBase';

export interface DashboardLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  draftCount?: number;
  children: React.ReactNode;
  onSearchQuery?: (query: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
  draftCount = 0,
  children,
  onSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar Header */}
      <DashboardNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onSearchQuery={onSearchQuery}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          draftCount={draftCount}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Mobile Navigation Drawer */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          draftCount={draftCount}
        />

        {/* Dynamic Content View Container */}
        <main
          id="dashboard-content-area"
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col justify-between"
        >
          <div className="space-y-6 flex-1">{children}</div>

          {/* Footer Section */}
          <div className="mt-8 pt-4 border-t border-slate-900">
            <FooterBase version="v2.0.0 Control Panel" />
          </div>
        </main>
      </div>
    </div>
  );
};
