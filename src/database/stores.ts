export const STORES = {
  USERS: 'users',
  POSTS: 'posts',
  SCHEDULES: 'schedules',
  MEDIA: 'media',
  SETTINGS: 'settings',
  LOGS: 'logs',
  SOCIAL_ACCOUNTS: 'social_accounts',
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

export function initializeObjectStores(db: IDBDatabase) {
  // 1. USERS Store
  if (!db.objectStoreNames.contains(STORES.USERS)) {
    const userStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
    userStore.createIndex('email', 'email', { unique: true });
    userStore.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // 2. POSTS Store
  if (!db.objectStoreNames.contains(STORES.POSTS)) {
    const postStore = db.createObjectStore(STORES.POSTS, { keyPath: 'id' });
    postStore.createIndex('status', 'status', { unique: false });
    postStore.createIndex('platform', 'platform', { unique: false });
    postStore.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // 3. SCHEDULES Store
  if (!db.objectStoreNames.contains(STORES.SCHEDULES)) {
    const schedStore = db.createObjectStore(STORES.SCHEDULES, { keyPath: 'id' });
    schedStore.createIndex('postId', 'postId', { unique: false });
    schedStore.createIndex('status', 'status', { unique: false });
    schedStore.createIndex('scheduledTime', 'scheduledTime', { unique: false });
  }

  // 4. MEDIA Store
  if (!db.objectStoreNames.contains(STORES.MEDIA)) {
    const mediaStore = db.createObjectStore(STORES.MEDIA, { keyPath: 'id' });
    mediaStore.createIndex('fileType', 'fileType', { unique: false });
    mediaStore.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // 5. SETTINGS Store
  if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
    db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
  }

  // 6. LOGS Store
  if (!db.objectStoreNames.contains(STORES.LOGS)) {
    const logStore = db.createObjectStore(STORES.LOGS, { keyPath: 'id' });
    logStore.createIndex('type', 'type', { unique: false });
    logStore.createIndex('status', 'status', { unique: false });
    logStore.createIndex('createdAt', 'createdAt', { unique: false });
  }

  // 7. SOCIAL_ACCOUNTS Store
  if (!db.objectStoreNames.contains(STORES.SOCIAL_ACCOUNTS)) {
    const channelStore = db.createObjectStore(STORES.SOCIAL_ACCOUNTS, { keyPath: 'id' });
    channelStore.createIndex('platform', 'platform', { unique: false });
    channelStore.createIndex('status', 'status', { unique: false });
  }
}
