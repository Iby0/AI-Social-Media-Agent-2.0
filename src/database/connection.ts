import { initializeObjectStores } from './stores';

const DB_NAME = 'AISocialAgentDB_V2';
const DB_VERSION = 2;

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async getConnection(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this runtime environment.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        initializeObjectStores(db);
      };

      request.onsuccess = () => {
        const db = request.result;

        db.onversionchange = () => {
          db.close();
          this.dbPromise = null;
          console.warn('Database connection closed due to a version change in another tab.');
        };

        resolve(db);
      };

      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error || new Error('Failed to open IndexedDB connection.'));
      };

      request.onblocked = () => {
        console.warn('IndexedDB connection blocked by another open tab.');
      };
    });

    return this.dbPromise;
  }

  public async closeConnection(): Promise<void> {
    if (this.dbPromise) {
      const db = await this.dbPromise;
      db.close();
      this.dbPromise = null;
    }
  }
}

export const dbConnection = DatabaseConnection.getInstance();
