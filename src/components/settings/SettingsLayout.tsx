import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Languages,
  Clock,
  Bell,
  HardDrive,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  Search,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { ThemeSettings } from './ThemeSettings';
import { LanguageSettings } from './LanguageSettings';
import { TimezoneSettings } from './TimezoneSettings';
import { NotificationSettings } from './NotificationSettings';
import { StorageSettings } from './StorageSettings';
import { CleanupSettings } from './CleanupSettings';
import { useSettingsContext } from '../../providers/SettingsContext';

export type SettingsSection = 'all' | 'appearance' | 'regional' | 'notifications' | 'storage' | 'cleanup';

export const SettingsLayout: React.FC = () => {
  const { resetSettings, exportSettings, importSettings, error } = useSettingsContext();
  const [activeSection, setActiveSection] = useState<SettingsSection>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const navItems: { id: SettingsSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Preferences', icon: Sliders },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'regional', label: 'Language & Time', icon: Languages },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'storage', label: 'Storage Quota', icon: HardDrive },
    { id: 'cleanup', label: 'Auto Cleanup', icon: Trash2 },
  ];

  const handleExportJSON = async () => {
    try {
      const json = await exportSettings();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_settings_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg('UserSettings JSON exported successfully!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert('Failed to export settings.');
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target?.result as string;
        await importSettings(content);
        setStatusMsg('UserSettings imported successfully!');
        setTimeout(() => setStatusMsg(null), 3000);
      } catch (err: any) {
        alert(err.message || 'Invalid user settings JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = async () => {
    try {
      await resetSettings();
      setShowResetConfirm(false);
      setStatusMsg('UserSettings restored to default!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Failed to reset settings.');
    }
  };

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">User Settings & Preferences</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              Module 10
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Customize application theme, language, timezone, notifications, and IndexedDB storage cleanup rules.
          </p>
        </div>

        {/* Global Quick Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {statusMsg && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
              <Check className="h-4 w-4" /> {statusMsg}
            </div>
          )}

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Export settings to JSON file"
          >
            <Download className="h-4 w-4 text-indigo-400" /> Export JSON
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all">
            <Upload className="h-4 w-4 text-emerald-400" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Reset settings to default"
          >
            <RotateCcw className="h-4 w-4" /> Reset Defaults
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-semibold">
          {error}
        </div>
      )}

      {/* Navigation Sub-Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Settings Sections Grid */}
      <div className="space-y-6">
        {/* Section 1: Appearance */}
        {(activeSection === 'all' || activeSection === 'appearance') && matchesSearch('appearance theme dark light system') && (
          <ThemeSettings />
        )}

        {/* Section 2 & 3: Language & Timezone */}
        {(activeSection === 'all' || activeSection === 'regional') && matchesSearch('language english bengali timezone date time format schedule') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LanguageSettings />
            <TimezoneSettings />
          </div>
        )}

        {/* Section 4: Notifications */}
        {(activeSection === 'all' || activeSection === 'notifications') && matchesSearch('notification alert reminder schedule post') && (
          <NotificationSettings />
        )}

        {/* Section 5 & 6: Storage & Cleanup */}
        {(activeSection === 'all' || activeSection === 'storage' || activeSection === 'cleanup') &&
          matchesSearch('storage limit auto cleanup frequency daily weekly monthly indexeddb quota') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StorageSettings />
              <CleanupSettings />
            </div>
          )}
      </div>

      {/* Reset Defaults Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <RotateCcw className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Reset All User Settings?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to reset your theme, language, timezone, notification, and storage preferences back to factory default values?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-rose-600/20"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
