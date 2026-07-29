import { ImageInputModel, ImageOutputModel, ImageCacheEntry } from '../../types/image-ai';

const CACHE_KEY_PREFIX = 'image_ai_cache_v1_';
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export class ImageCacheService {
  private hashInput(input: ImageInputModel): string {
    const raw = `${input.platform}_${input.imageType}_${input.topic}_${input.style}_${input.aspectRatio}_${(input.keywords || []).join(',')}_${input.customPrompt || ''}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}`;
  }

  public get(input: ImageInputModel): ImageOutputModel | null {
    try {
      const key = CACHE_KEY_PREFIX + this.hashInput(input);
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const entry: ImageCacheEntry = JSON.parse(raw);
      if (new Date(entry.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      return entry.output;
    } catch {
      return null;
    }
  }

  public set(input: ImageInputModel, output: ImageOutputModel, ttlMs: number = DEFAULT_TTL_MS): void {
    try {
      const hash = this.hashInput(input);
      const key = CACHE_KEY_PREFIX + hash;
      const now = new Date();
      const expiresAt = new Date(now.getTime() + ttlMs).toISOString();

      const entry: ImageCacheEntry = {
        key,
        inputHash: hash,
        input,
        output,
        timestamp: now.toISOString(),
        expiresAt,
      };

      localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('Failed to save image cache entry to localStorage:', e);
    }
  }

  public clear(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error('Failed to clear image cache:', e);
    }
  }
}

export const imageCacheService = new ImageCacheService();
