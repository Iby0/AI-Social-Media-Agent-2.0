/**
 * Settings Utilities
 * Module 10 - AI Social Media Agent
 */

import { UserSettings, DateFormatOption, TimeFormatOption, LanguageOption } from '../../database/types';
import { DEFAULT_USER_SETTINGS } from '../../database/services/settingService';

export const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (GMT+6)' },
  { value: 'America/New_York', label: 'America/New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT)' },
];

export const SUPPORTED_LANGUAGES: { code: LanguageOption; name: string; nativeName: string; isBeta?: boolean }[] = [
  { code: 'EN', name: 'English', nativeName: 'English (US)' },
  { code: 'BN', name: 'Bengali', nativeName: 'বাংলা (Bengali)' },
];

export function getDefaultUserSettings(): UserSettings {
  return { ...DEFAULT_USER_SETTINGS };
}

export function formatDateWithUserSettings(
  dateInput: Date | string | number,
  dateFormat: DateFormatOption = 'YYYY-MM-DD',
  timeFormat: TimeFormatOption = '24h',
  timezone: string = 'UTC'
): string {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let dateStr = `${year}-${month}-${day}`;
    if (dateFormat === 'MM/DD/YYYY') {
      dateStr = `${month}/${day}/${year}`;
    } else if (dateFormat === 'DD/MM/YYYY') {
      dateStr = `${day}/${month}/${year}`;
    }

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    let timeStr = '';

    if (timeFormat === '12h') {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      timeStr = `${hours}:${minutes} ${ampm}`;
    } else {
      timeStr = `${String(hours).padStart(2, '0')}:${minutes}`;
    }

    return `${dateStr} ${timeStr}`;
  } catch {
    return date.toLocaleString();
  }
}
