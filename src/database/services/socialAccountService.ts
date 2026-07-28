import { dbConnection } from '../connection';
import { STORES } from '../stores';
import { SocialAccountRecord } from '../types';

export class SocialAccountService {
  async getAll(): Promise<SocialAccountRecord[]> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SOCIAL_ACCOUNTS, 'readonly');
      const store = tx.objectStore(STORES.SOCIAL_ACCOUNTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getById(id: string): Promise<SocialAccountRecord | null> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SOCIAL_ACCOUNTS, 'readonly');
      const store = tx.objectStore(STORES.SOCIAL_ACCOUNTS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async save(
    account: Omit<SocialAccountRecord, 'connectedAt'> & { connectedAt?: string }
  ): Promise<SocialAccountRecord> {
    const db = await dbConnection.getConnection();
    const record: SocialAccountRecord = {
      ...account,
      connectedAt: account.connectedAt || new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SOCIAL_ACCOUNTS, 'readwrite');
      const store = tx.objectStore(STORES.SOCIAL_ACCOUNTS);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(id: string): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SOCIAL_ACCOUNTS, 'readwrite');
      const store = tx.objectStore(STORES.SOCIAL_ACCOUNTS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async search(query: string): Promise<SocialAccountRecord[]> {
    const all = await this.getAll();
    const q = query.toLowerCase().trim();
    if (!q) return all;
    return all.filter((a) => a.platform.toLowerCase().includes(q) || a.username.toLowerCase().includes(q));
  }

  async clear(): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SOCIAL_ACCOUNTS, 'readwrite');
      const store = tx.objectStore(STORES.SOCIAL_ACCOUNTS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const socialAccountService = new SocialAccountService();
