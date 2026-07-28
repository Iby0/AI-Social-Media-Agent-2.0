/**
 * Storage Cleanup Utilities
 * Module 09 - AI Social Media Agent
 */

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function estimateObjectSizeBytes(obj: any): number {
  if (!obj) return 0;
  try {
    const str = JSON.stringify(obj);
    return new Blob([str]).size;
  } catch {
    return 100;
  }
}

export function isOlderThanDays(dateIsoString: string, days: number): boolean {
  if (!dateIsoString) return false;
  const itemDate = new Date(dateIsoString).getTime();
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return itemDate < cutoff;
}

export function calculateLocalStorageSizeBytes(): number {
  if (typeof window === 'undefined' || !window.localStorage) return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const val = localStorage.getItem(key) || '';
      total += key.length + val.length;
    }
  }
  return total * 2; // UTF-16 bytes approx
}
