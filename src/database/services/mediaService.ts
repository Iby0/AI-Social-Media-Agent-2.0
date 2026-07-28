import { dbConnection } from '../connection';
import { STORES } from '../stores';
import { MediaRecord } from '../types';

export class MediaService {
  async getAll(): Promise<MediaRecord[]> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.MEDIA, 'readonly');
      const store = tx.objectStore(STORES.MEDIA);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result || [];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getById(id: string): Promise<MediaRecord | null> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.MEDIA, 'readonly');
      const store = tx.objectStore(STORES.MEDIA);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async save(media: Omit<MediaRecord, 'createdAt'> & { createdAt?: string }): Promise<MediaRecord> {
    const db = await dbConnection.getConnection();
    const record: MediaRecord = {
      ...media,
      createdAt: media.createdAt || new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.MEDIA, 'readwrite');
      const store = tx.objectStore(STORES.MEDIA);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(id: string): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.MEDIA, 'readwrite');
      const store = tx.objectStore(STORES.MEDIA);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async search(query: string): Promise<MediaRecord[]> {
    const all = await this.getAll();
    const q = query.toLowerCase().trim();
    if (!q) return all;
    return all.filter((m) => m.fileName.toLowerCase().includes(q) || m.fileType.toLowerCase().includes(q));
  }

  async clear(): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.MEDIA, 'readwrite');
      const store = tx.objectStore(STORES.MEDIA);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const mediaService = new MediaService();
