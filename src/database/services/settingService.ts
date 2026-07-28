import { dbConnection } from '../connection';
import { STORES } from '../stores';
import { SettingRecord } from '../types';

const DEFAULT_SETTINGS_KEY = 'app_settings';

export const DEFAULT_USER_SETTINGS: SettingRecord = {
  id: DEFAULT_SETTINGS_KEY,
  userId: 'user_default',
  theme: 'system',
  language: 'EN',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  notifications: {
    enabled: true,
    postReminder: true,
    scheduleReminder: true,
    systemAlerts: true,
  },
  storageLimit: 500,
  autoCleanup: true,
  cleanupFrequency: 'weekly',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export class SettingService {
  async getSettings(): Promise<SettingRecord> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readonly');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.get(DEFAULT_SETTINGS_KEY);
      req.onsuccess = () => {
        if (req.result) {
          // Merge with defaults to guarantee all fields exist
          resolve({
            ...DEFAULT_USER_SETTINGS,
            ...req.result,
            notifications: {
              ...DEFAULT_USER_SETTINGS.notifications,
              ...(req.result.notifications || {}),
            },
          });
        } else {
          resolve({ ...DEFAULT_USER_SETTINGS });
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  async saveSettings(settings: Partial<SettingRecord>): Promise<SettingRecord> {
    const current = await this.getSettings();
    const updated: SettingRecord = {
      ...current,
      ...settings,
      notifications: {
        ...current.notifications,
        ...(settings.notifications || {}),
      },
      id: DEFAULT_SETTINGS_KEY,
      updatedAt: new Date().toISOString(),
    };

    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readwrite');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.put(updated);
      req.onsuccess = () => resolve(updated);
      req.onerror = () => reject(req.error);
    });
  }

  async clear(): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readwrite');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const settingService = new SettingService();
