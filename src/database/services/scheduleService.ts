import { dbConnection } from '../connection';
import { STORES } from '../stores';
import { ScheduleRecord } from '../types';

export class ScheduleService {
  async getAll(): Promise<ScheduleRecord[]> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SCHEDULES, 'readonly');
      const store = tx.objectStore(STORES.SCHEDULES);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result || [];
        list.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getById(id: string): Promise<ScheduleRecord | null> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SCHEDULES, 'readonly');
      const store = tx.objectStore(STORES.SCHEDULES);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async save(schedule: Omit<ScheduleRecord, 'createdAt'> & { createdAt?: string }): Promise<ScheduleRecord> {
    const db = await dbConnection.getConnection();
    const record: ScheduleRecord = {
      ...schedule,
      createdAt: schedule.createdAt || new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SCHEDULES, 'readwrite');
      const store = tx.objectStore(STORES.SCHEDULES);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(id: string): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SCHEDULES, 'readwrite');
      const store = tx.objectStore(STORES.SCHEDULES);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async search(query: string): Promise<ScheduleRecord[]> {
    const all = await this.getAll();
    const q = query.toLowerCase().trim();
    if (!q) return all;
    return all.filter((s) => s.platform.toLowerCase().includes(q) || s.status.toLowerCase().includes(q));
  }

  async clear(): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SCHEDULES, 'readwrite');
      const store = tx.objectStore(STORES.SCHEDULES);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const scheduleService = new ScheduleService();
