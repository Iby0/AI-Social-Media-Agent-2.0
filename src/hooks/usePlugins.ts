import { usePluginContext } from '../context/PluginContext';

export const usePlugins = () => {
  const { plugins, searchQuery, selectedCategory, isLoading } = usePluginContext();

  const filteredPlugins = plugins.filter((plugin) => {
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const installedPlugins = filteredPlugins.filter(
    (p) => p.state === 'Installed' || p.state === 'Enabled' || p.state === 'Disabled' || p.state === 'Updated' || p.state === 'Error'
  );

  const availableLocalPlugins = filteredPlugins.filter((p) => p.state === 'Detected' || p.state === 'Removed');

  const enabledPlugins = filteredPlugins.filter((p) => p.state === 'Enabled');

  return {
    plugins: filteredPlugins,
    installedPlugins,
    availableLocalPlugins,
    enabledPlugins,
    isLoading,
  };
};
