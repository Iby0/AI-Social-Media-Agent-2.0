import { dbConnection } from '../connection';
import { STORES } from '../stores';
import { UserRecord } from '../types';

export class UserService {
  async getAll(): Promise<UserRecord[]> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.USERS, 'readonly');
      const store = tx.objectStore(STORES.USERS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getById(id: string): Promise<UserRecord | null> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.USERS, 'readonly');
      const store = tx.objectStore(STORES.USERS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async create(user: Omit<UserRecord, 'createdAt' | 'updatedAt'>): Promise<UserRecord> {
    const db = await dbConnection.getConnection();
    const now = new Date().toISOString();
    const record: UserRecord = {
      ...user,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.USERS, 'readwrite');
      const store = tx.objectStore(STORES.USERS);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async update(id: string, updates: Partial<UserRecord>): Promise<UserRecord> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedRecord: UserRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.USERS, 'readwrite');
      const store = tx.objectStore(STORES.USERS);
      const req = store.put(updatedRecord);
      req.onsuccess = () => resolve(updatedRecord);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(id: string): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.USERS, 'readwrite');
      const store = tx.objectStore(STORES.USERS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async search(query: string): Promise<UserRecord[]> {
    const all = await this.getAll();
    const q = query.toLowerCase().trim();
    if (!q) return all;
    return all.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  async clear(): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.USERS, 'readwrite');
      const store = tx.objectStore(STORES.USERS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const userService = new UserService();
