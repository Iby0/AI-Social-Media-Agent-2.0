import { dbConnection } from '../connection';
import { STORES } from '../stores';
import { PostRecord } from '../types';

export class PostService {
  async getAll(): Promise<PostRecord[]> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.POSTS, 'readonly');
      const store = tx.objectStore(STORES.POSTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result || [];
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getById(id: string): Promise<PostRecord | null> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.POSTS, 'readonly');
      const store = tx.objectStore(STORES.POSTS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async save(post: Omit<PostRecord, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }): Promise<PostRecord> {
    const db = await dbConnection.getConnection();
    const now = new Date().toISOString();
    const record: PostRecord = {
      ...post,
      createdAt: post.createdAt || now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.POSTS, 'readwrite');
      const store = tx.objectStore(STORES.POSTS);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(id: string): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.POSTS, 'readwrite');
      const store = tx.objectStore(STORES.POSTS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async search(query: string): Promise<PostRecord[]> {
    const all = await this.getAll();
    const q = query.toLowerCase().trim();
    if (!q) return all;
    return all.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.caption.toLowerCase().includes(q) ||
        p.platform.toLowerCase().includes(q)
    );
  }

  async clear(): Promise<void> {
    const db = await dbConnection.getConnection();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.POSTS, 'readwrite');
      const store = tx.objectStore(STORES.POSTS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const postService = new PostService();
