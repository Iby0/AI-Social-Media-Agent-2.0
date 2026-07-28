/**
 * Settings Context Provider
 * Module 10 - AI Social Media Agent
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserSettings, ThemeOption } from '../database/types';
import { settingsService } from '../services/settings/settings.service';
import { getDefaultUserSettings } from '../services/settings/settings.utils';

export interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  updateSettings: (partial: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  exportSettings: () => Promise<string>;
  importSettings: (jsonStr: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(getDefaultUserSettings());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
      settingsService.applyThemeToDOM(data.theme);
    } catch (err: any) {
      console.error('SettingsProvider error:', err);
      setError(err.message || 'Failed to load user settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Handle system theme listener
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      settingsService.applyThemeToDOM('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  const updateSettings = async (partial: Partial<UserSettings>) => {
    try {
      setError(null);
      const updated = await settingsService.updateSettings(partial);
      setSettings(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
      throw err;
    }
  };

  const resetSettings = async () => {
    try {
      setError(null);
      const reset = await settingsService.resetSettings();
      setSettings(reset);
    } catch (err: any) {
      setError(err.message || 'Failed to reset settings');
      throw err;
    }
  };

  const exportSettings = async () => {
    return await settingsService.exportSettingsJSON();
  };

  const importSettings = async (jsonStr: string) => {
    try {
      setError(null);
      const imported = await settingsService.importSettingsJSON(jsonStr);
      setSettings(imported);
    } catch (err: any) {
      setError(err.message || 'Failed to import settings');
      throw err;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSettings,
        resetSettings,
        refreshSettings,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
