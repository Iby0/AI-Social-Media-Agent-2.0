import { dbConnection } from '../connection';
import { STORES } from '../stores';
import { SettingRecord } from '../types';

const DEFAULT_SETTINGS_KEY = 'app_settings';

export class SettingService {
  async getSettings(): Promise<SettingRecord> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readonly');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.get(DEFAULT_SETTINGS_KEY);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result);
        } else {
          // Default fallback settings
          const defaultSettings: SettingRecord = {
            id: DEFAULT_SETTINGS_KEY,
            theme: 'dark',
            language: 'EN',
            timezone: 'UTC',
            storageLimit: 500,
            autoCleanup: true,
          };
          resolve(defaultSettings);
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
      id: DEFAULT_SETTINGS_KEY,
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
