import { PublishHistoryRecord } from '../../publishers/publisher.types';

const STORAGE_KEY = 'ai_publishing_engine_history';

export class HistoryService {
  static getHistory(): PublishHistoryRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static addRecord(record: PublishHistoryRecord): void {
    const history = this.getHistory();
    history.unshift(record);
    // Keep max 200 records
    if (history.length > 200) {
      history.pop();
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to persist history to localStorage', e);
    }
  }

  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
