import React, { useState } from 'react';
import { PluginProvider } from '../../context/PluginContext';
import { usePlugins } from '../../hooks/usePlugins';
import { usePluginManager } from '../../hooks/usePluginManager';
import { PluginCard } from './PluginCard';
import { PluginDetails } from './PluginDetails';
import { PluginLogs } from './PluginLogs';
import { PluginInstaller } from './PluginInstaller';
import { PluginManifest, PluginCategory } from '../../types/plugin';
import {
  Puzzle,
  Search,
  Filter,
  PlusCircle,
  History,
  CheckCircle2,
  Power,
  HardDrive,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';

const InnerPluginDashboard: React.FC = () => {
  const { plugins, installedPlugins, availableLocalPlugins, enabledPlugins, isLoading } =
    usePlugins();
  const {
    installPlugin,
    enablePlugin,
    disablePlugin,
    reloadPlugin,
    removePlugin,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = usePluginManager();

  const [activeTab, setActiveTab] = useState<
    'installed' | 'available' | 'all' | 'logs' | 'installer'
  >('installed');

  const [selectedPluginDetails, setSelectedPluginDetails] = useState<PluginManifest | null>(null);

  const categories: { id: PluginCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'ai_provider', label: 'AI Providers' },
    { id: 'image_provider', label: 'Image Providers' },
    { id: 'social_platform', label: 'Social Platforms' },
    { id: 'workflow', label: 'Workflows' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'export', label: 'Exporters' },
    { id: 'import', label: 'Importers' },
    { id: 'backup', label: 'Backups' },
    { id: 'storage', label: 'Storage' },
    { id: 'theme', label: 'Themes' },
    { id: 'notification', label: 'Notifications' },
    { id: 'webhook', label: 'Webhooks' },
  ];

  const displayedList =
    activeTab === 'installed'
      ? installedPlugins
      : activeTab === 'available'
      ? availableLocalPlugins
      : plugins;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Puzzle className="w-3 h-3" /> Plugin & Extension Engine
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> Offline Local Sandbox
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Plugin Manager & Extension Framework
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Extend application capabilities with local-first AI providers, analytics heatmaps, export tools, webhooks, and custom workflow triggers.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 shrink-0 relative z-10 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
          <div className="text-center px-3 border-r border-slate-700/80">
            <span className="block text-lg font-black text-white">{plugins.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total</span>
          </div>
          <div className="text-center px-3 border-r border-slate-700/80">
            <span className="block text-lg font-black text-emerald-400">{enabledPlugins.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-lg font-black text-indigo-400">{installedPlugins.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Installed</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plugins by name, description, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('installed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'installed'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Installed ({installedPlugins.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'available'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Available Local ({availableLocalPlugins.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Local Catalog ({plugins.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Logs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('installer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'installer'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Custom Installer</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'installer' && <PluginInstaller onSuccess={() => setActiveTab('installed')} />}

      {activeTab === 'logs' && <PluginLogs />}

      {(activeTab === 'installed' || activeTab === 'available' || activeTab === 'all') && (
        <>
          {displayedList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Puzzle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Plugins Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No local plugins match your current tab selection or search filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedList.map((plugin) => (
                <PluginCard
                  key={plugin.id}
                  plugin={plugin}
                  onInstall={installPlugin}
                  onEnable={enablePlugin}
                  onDisable={disablePlugin}
                  onReload={reloadPlugin}
                  onRemove={removePlugin}
                  onViewDetails={setSelectedPluginDetails}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Plugin Details Modal */}
      <PluginDetails
        plugin={selectedPluginDetails}
        onClose={() => setSelectedPluginDetails(null)}
        onEnable={enablePlugin}
        onDisable={disablePlugin}
      />
    </div>
  );
};

export const PluginDashboard: React.FC = () => {
  return (
    <PluginProvider>
      <InnerPluginDashboard />
    </PluginProvider>
  );
};
