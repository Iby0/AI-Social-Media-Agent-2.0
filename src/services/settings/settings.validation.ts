/**
 * Settings Validation Engine
 * Module 10 - AI Social Media Agent
 */

import { UserSettings, ThemeOption, LanguageOption, DateFormatOption, TimeFormatOption, CleanupFrequencyOption } from '../../database/types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateUserSettings(settings: Partial<UserSettings>): ValidationResult {
  const errors: Record<string, string> = {};

  if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
    errors.theme = 'Invalid theme option. Choose Light, Dark, or System.';
  }

  if (settings.language && !['EN', 'BN'].includes(settings.language)) {
    errors.language = 'Invalid language option.';
  }

  if (settings.dateFormat && !['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'].includes(settings.dateFormat)) {
    errors.dateFormat = 'Invalid date format.';
  }

  if (settings.timeFormat && !['12h', '24h'].includes(settings.timeFormat)) {
    errors.timeFormat = 'Invalid time format.';
  }

  if (settings.storageLimit !== undefined) {
    if (typeof settings.storageLimit !== 'number' || settings.storageLimit < 50 || settings.storageLimit > 10000) {
      errors.storageLimit = 'Storage limit must be a number between 50 MB and 10,000 MB.';
    }
  }

  if (settings.cleanupFrequency && !['daily', 'weekly', 'monthly', 'never'].includes(settings.cleanupFrequency)) {
    errors.cleanupFrequency = 'Invalid auto cleanup frequency.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function sanitizeUserSettings(settings: Partial<UserSettings>): Partial<UserSettings> {
  const sanitized: Partial<UserSettings> = { ...settings };

  if (sanitized.storageLimit) {
    sanitized.storageLimit = Math.max(50, Math.min(10000, Number(sanitized.storageLimit)));
  }

  return sanitized;
}
