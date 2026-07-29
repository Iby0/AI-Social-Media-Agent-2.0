import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PluginManifest, PluginLogRecord, PluginCategory } from '../types/plugin';
import { PluginManager } from '../services/plugins/plugin-manager';

interface PluginContextType {
  plugins: PluginManifest[];
  logs: PluginLogRecord[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: PluginCategory | 'all';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: PluginCategory | 'all') => void;
  refreshPlugins: () => void;
  installPlugin: (id: string) => Promise<void>;
  enablePlugin: (id: string) => Promise<void>;
  disablePlugin: (id: string) => Promise<void>;
  updatePlugin: (id: string, newVersion: string) => Promise<void>;
  removePlugin: (id: string) => Promise<void>;
  reloadPlugin: (id: string) => Promise<void>;
  importManifestJson: (json: string) => void;
  clearLogs: () => void;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export const PluginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plugins, setPlugins] = useState<PluginManifest[]>([]);
  const [logs, setLogs] = useState<PluginLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory | 'all'>('all');

  const refreshPlugins = useCallback(() => {
    setIsLoading(true);
    try {
      const list = PluginManager.getPlugins();
      const auditLogs = PluginManager.getLogs();
      setPlugins(list);
      setLogs(auditLogs);
    } catch (err) {
      console.error('Failed loading plugins:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPlugins();
  }, [refreshPlugins]);

  const handleInstall = async (id: string) => {
    await PluginManager.installPlugin(id);
    refreshPlugins();
  };

  const handleEnable = async (id: string) => {
    await PluginManager.enablePlugin(id);
    refreshPlugins();
  };

  const handleDisable = async (id: string) => {
    await PluginManager.disablePlugin(id);
    refreshPlugins();
  };

  const handleUpdate = async (id: string, newVersion: string) => {
    await PluginManager.updatePlugin(id, newVersion);
    refreshPlugins();
  };

  const handleRemove = async (id: string) => {
    await PluginManager.removePlugin(id);
    refreshPlugins();
  };

  const handleReload = async (id: string) => {
    await PluginManager.reloadPlugin(id);
    refreshPlugins();
  };

  const handleImportJson = (json: string) => {
    PluginManager.registerLocalManifest(json);
    refreshPlugins();
  };

  const handleClearLogs = () => {
    PluginManager.clearLogs();
    refreshPlugins();
  };

  return (
    <PluginContext.Provider
      value={{
        plugins,
        logs,
        isLoading,
        searchQuery,
        selectedCategory,
        setSearchQuery,
        setSelectedCategory,
        refreshPlugins,
        installPlugin: handleInstall,
        enablePlugin: handleEnable,
        disablePlugin: handleDisable,
        updatePlugin: handleUpdate,
        removePlugin: handleRemove,
        reloadPlugin: handleReload,
        importManifestJson: handleImportJson,
        clearLogs: handleClearLogs,
      }}
    >
      {children}
    </PluginContext.Provider>
  );
};

export const usePluginContext = (): PluginContextType => {
  const ctx = useContext(PluginContext);
  if (!ctx) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return ctx;
};
