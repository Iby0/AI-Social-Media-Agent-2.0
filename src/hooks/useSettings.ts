/**
 * Hook for accessing User Settings
 * Module 10 - AI Social Media Agent
 */

import { useSettingsContext } from '../providers/SettingsContext';
import { formatDateWithUserSettings } from '../services/settings/settings.utils';

export function useSettings() {
  const context = useSettingsContext();

  const formatDate = (date: Date | string | number) => {
    return formatDateWithUserSettings(
      date,
      context.settings.dateFormat,
      context.settings.timeFormat,
      context.settings.timezone
    );
  };

  return {
    ...context,
    formatDate,
  };
}
