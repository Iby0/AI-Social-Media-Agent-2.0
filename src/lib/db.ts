import { Post, SocialChannel, PromptTemplate, AnalyticsMetric, ActivityLog, BackupSettings } from '../types';

const DB_NAME = 'AISocialAgentDB';
const DB_VERSION = 1;

class IndexedDBEngine {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('posts')) {
          const postStore = db.createObjectStore('posts', { keyPath: 'id' });
          postStore.createIndex('status', 'status', { unique: false });
          postStore.createIndex('scheduledAt', 'scheduledAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('channels')) {
          db.createObjectStore('channels', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id' });
          analyticsStore.createIndex('date', 'date', { unique: false });
          analyticsStore.createIndex('platform', 'platform', { unique: false });
        }

        if (!db.objectStoreNames.contains('logs')) {
          db.createObjectStore('logs', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- POSTS ---
  async getAllPosts(): Promise<Post[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('posts', 'readonly');
      const store = tx.objectStore('posts');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async savePost(post: Post): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('posts', 'readwrite');
      const store = tx.objectStore('posts');
      const request = store.put(post);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deletePost(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('posts', 'readwrite');
      const store = tx.objectStore('posts');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- CHANNELS ---
  async getAllChannels(): Promise<SocialChannel[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('channels', 'readonly');
      const store = tx.objectStore('channels');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveChannel(channel: SocialChannel): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('channels', 'readwrite');
      const store = tx.objectStore('channels');
      const request = store.put(channel);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- TEMPLATES ---
  async getAllTemplates(): Promise<PromptTemplate[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('templates', 'readonly');
      const store = tx.objectStore('templates');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveTemplate(template: PromptTemplate): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('templates', 'readwrite');
      const store = tx.objectStore('templates');
      const request = store.put(template);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('templates', 'readwrite');
      const store = tx.objectStore('templates');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- ANALYTICS ---
  async getAllAnalytics(): Promise<AnalyticsMetric[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('analytics', 'readonly');
      const store = tx.objectStore('analytics');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAnalytics(metrics: AnalyticsMetric[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('analytics', 'readwrite');
      const store = tx.objectStore('analytics');
      metrics.forEach((m) => store.put(m));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- ACTIVITY LOGS ---
  async getAllLogs(): Promise<ActivityLog[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('logs', 'readonly');
      const store = tx.objectStore('logs');
      const request = store.getAll();
      request.onsuccess = () => {
        const list = request.result || [];
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async logActivity(action: string, category: ActivityLog['category'], details: string, status: ActivityLog['status'] = 'info'): Promise<void> {
    const db = await this.getDB();
    const logItem: ActivityLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      action,
      category,
      details,
      status,
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction('logs', 'readwrite');
      const store = tx.objectStore('logs');
      const request = store.put(logItem);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- BACKUP & SETTINGS ---
  async getSettings(): Promise<BackupSettings | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const request = store.get('backup_config');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: BackupSettings): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const request = store.put({ id: 'backup_config', ...settings });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // EXPORT FULL DATABASE TO JSON
  async exportDatabaseJSON(): Promise<string> {
    const [posts, channels, templates, analytics, logs, settings] = await Promise.all([
      this.getAllPosts(),
      this.getAllChannels(),
      this.getAllTemplates(),
      this.getAllAnalytics(),
      this.getAllLogs(),
      this.getSettings(),
    ]);

    const backupObj = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      posts,
      channels,
      templates,
      analytics,
      logs,
      settings,
    };

    return JSON.stringify(backupObj, null, 2);
  }

  // IMPORT JSON BACKUP INTO INDEXEDDB
  async importDatabaseJSON(jsonStr: string): Promise<void> {
    const data = JSON.parse(jsonStr);
    if (data.posts && Array.isArray(data.posts)) {
      for (const p of data.posts) await this.savePost(p);
    }
    if (data.channels && Array.isArray(data.channels)) {
      for (const c of data.channels) await this.saveChannel(c);
    }
    if (data.templates && Array.isArray(data.templates)) {
      for (const t of data.templates) await this.saveTemplate(t);
    }
    if (data.settings) {
      await this.saveSettings(data.settings);
    }
    await this.logActivity('Database Restored', 'backup', 'Successfully restored IndexedDB snapshot from JSON.', 'success');
  }
}

export const db = new IndexedDBEngine();
