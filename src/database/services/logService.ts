import { dbConnection } from '../connection';
import { STORES } from '../stores';
import { LogRecord } from '../types';

export class LogService {
  async getAll(): Promise<LogRecord[]> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.LOGS, 'readonly');
      const store = tx.objectStore(STORES.LOGS);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result || [];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async log(
    message: string,
    type: LogRecord['type'] = 'system',
    status: LogRecord['status'] = 'info'
  ): Promise<LogRecord> {
    const db = await dbConnection.getConnection();
    const logItem: LogRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      message,
      type,
      status,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.LOGS, 'readwrite');
      const store = tx.objectStore(STORES.LOGS);
      const req = store.put(logItem);
      req.onsuccess = () => resolve(logItem);
      req.onerror = () => reject(req.error);
    });
  }

  async addLog(entry: { message: string; type?: LogRecord['type']; status?: LogRecord['status'] }): Promise<LogRecord> {
    return this.log(entry.message, entry.type || 'system', entry.status || 'info');
  }

  async delete(id: string): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.LOGS, 'readwrite');
      const store = tx.objectStore(STORES.LOGS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async search(query: string): Promise<LogRecord[]> {
    const all = await this.getAll();
    const q = query.toLowerCase().trim();
    if (!q) return all;
    return all.filter(
      (l) => l.message.toLowerCase().includes(q) || l.type.toLowerCase().includes(q) || l.status.toLowerCase().includes(q)
    );
  }

  async deleteOlderThanDays(days: number): Promise<number> {
    const all = await this.getAll();
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).getTime();
    const oldLogs = all.filter((l) => new Date(l.createdAt).getTime() < cutoff);

    if (oldLogs.length === 0) return 0;

    const db = await dbConnection.getConnection();
    const tx = db.transaction(STORES.LOGS, 'readwrite');
    const store = tx.objectStore(STORES.LOGS);

    for (const logItem of oldLogs) {
      store.delete(logItem.id);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(oldLogs.length);
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear(): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.LOGS, 'readwrite');
      const store = tx.objectStore(STORES.LOGS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const logService = new LogService();
