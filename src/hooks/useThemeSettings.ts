/**
 * Hook for Theme Management
 * Module 10 - AI Social Media Agent
 */

import { useSettingsContext } from '../providers/SettingsContext';
import { ThemeOption } from '../database/types';

export function useThemeSettings() {
  const { settings, updateSettings } = useSettingsContext();

  const setTheme = async (theme: ThemeOption) => {
    await updateSettings({ theme });
  };

  const getResolvedTheme = (): 'light' | 'dark' => {
    if (settings.theme === 'system') {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    }
    return settings.theme;
  };

  const resolvedTheme = getResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  return {
    theme: settings.theme,
    resolvedTheme,
    isDark,
    setTheme,
  };
}
