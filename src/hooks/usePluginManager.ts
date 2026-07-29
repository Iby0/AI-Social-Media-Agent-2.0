import { usePluginContext } from '../context/PluginContext';

export const usePluginManager = () => {
  const {
    logs,
    installPlugin,
    enablePlugin,
    disablePlugin,
    updatePlugin,
    removePlugin,
    reloadPlugin,
    importManifestJson,
    clearLogs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refreshPlugins,
  } = usePluginContext();

  return {
    logs,
    installPlugin,
    enablePlugin,
    disablePlugin,
    updatePlugin,
    removePlugin,
    reloadPlugin,
    importManifestJson,
    clearLogs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refreshPlugins,
  };
};
