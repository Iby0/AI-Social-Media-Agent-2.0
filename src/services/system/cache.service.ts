export class CacheService {
  private static CACHE_PREFIX = 'ai_social_cache_v1';

  static async clearAllCaches(): Promise<void> {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  }

  static async getCacheStorageEstimate(): Promise<{ usage: number; quota: number }> {
    if ('storage' in navigator && navigator.storage.estimate) {
      const { usage = 0, quota = 0 } = await navigator.storage.estimate();
      return { usage, quota };
    }
    return { usage: 0, quota: 0 };
  }
}
