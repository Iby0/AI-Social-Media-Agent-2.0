/**
 * User Settings Service
 * Module 10 - AI Social Media Agent
 */

import { settingService } from '../../database/services/settingService';
import { UserSettings } from '../../database/types';
import { validateUserSettings, sanitizeUserSettings } from './settings.validation';
import { getDefaultUserSettings } from './settings.utils';
import { logService } from '../../database/services/logService';

export class SettingsService {
  async getSettings(): Promise<UserSettings> {
    try {
      const record = await settingService.getSettings();
      return record as UserSettings;
    } catch (err) {
      console.error('Failed to read user settings from IndexedDB:', err);
      return getDefaultUserSettings();
    }
  }

  async updateSettings(partial: Partial<UserSettings>): Promise<UserSettings> {
    const sanitized = sanitizeUserSettings(partial);
    const validation = validateUserSettings(sanitized);

    if (!validation.isValid) {
      const firstErr = Object.values(validation.errors)[0];
      throw new Error(`Settings Validation Error: ${firstErr}`);
    }

    const updated = await settingService.saveSettings(sanitized);

    // Apply theme changes to document
    if (sanitized.theme) {
      this.applyThemeToDOM(sanitized.theme);
    }

    // Log setting change
    await logService.addLog({
      type: 'user',
      message: `User settings updated (${Object.keys(sanitized).join(', ')})`,
      status: 'info',
    });

    return updated as UserSettings;
  }

  async resetSettings(): Promise<UserSettings> {
    const defaults = getDefaultUserSettings();
    const updated = await settingService.saveSettings(defaults);
    this.applyThemeToDOM(defaults.theme);

    await logService.addLog({
      type: 'user',
      message: 'User settings reset to factory defaults',
      status: 'warning',
    });

    return updated as UserSettings;
  }

  applyThemeToDOM(theme: 'light' | 'dark' | 'system'): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (theme === 'system' && prefersDark)) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }

  async exportSettingsJSON(): Promise<string> {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  async importSettingsJSON(jsonContent: string): Promise<UserSettings> {
    try {
      const parsed = JSON.parse(jsonContent);
      const validation = validateUserSettings(parsed);
      if (!validation.isValid) {
        throw new Error('Invalid JSON format for user settings.');
      }
      return await this.updateSettings(parsed);
    } catch (err: any) {
      throw new Error(`Import failed: ${err.message || 'Malformed JSON'}`);
    }
  }
}

export const settingsService = new SettingsService();
