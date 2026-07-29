import { AICacheEntry, AIInputModel, AIOutputModel } from '../../types/ai';

const CACHE_KEY_PREFIX = 'ai_cache_v1_';
const DEFAULT_TTL_HOURS = 24;

export class CacheService {
  private generateKey(input: AIInputModel): string {
    const raw = JSON.stringify({
      feature: input.feature,
      platform: input.platform,
      language: input.language,
      topic: (input.topic || '').trim().toLowerCase(),
      existingContent: (input.existingContent || '').trim().toLowerCase(),
      tone: input.tone,
      contentLength: input.contentLength,
      hashtagCount: input.hashtagCount,
      emojiLevel: input.emojiLevel,
      customInstructions: input.customInstructions,
    });

    // Simple hash function for key generation
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `${CACHE_KEY_PREFIX}${Math.abs(hash)}`;
  }

  public getCachedResult(input: AIInputModel): AIOutputModel | null {
    try {
      const key = this.generateKey(input);
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const entry: AICacheEntry = JSON.parse(raw);
      const now = new Date();
      const expiresAt = new Date(entry.expiresAt);

      if (now > expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.result;
    } catch (e) {
      console.warn('Cache read error:', e);
      return null;
    }
  }

  public setCacheResult(input: AIInputModel, result: AIOutputModel, ttlHours = DEFAULT_TTL_HOURS): void {
    try {
      const key = this.generateKey(input);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000);

      const entry: AICacheEntry = {
        key,
        inputHash: key.replace(CACHE_KEY_PREFIX, ''),
        feature: input.feature,
        platform: input.platform,
        language: input.language,
        result,
        timestamp: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  }

  public clearAllCache(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_KEY_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
  }

  public getCacheCount(): number {
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_KEY_PREFIX)) {
          count++;
        }
      }
    } catch (e) {
      // ignore
    }
    return count;
  }
}

export const cacheService = new CacheService();
