import { useState, useEffect, useCallback } from 'react';
import { AIHistoryItem } from '../types/ai';
import { aiService } from '../services/ai/ai.service';

export function useContentHistory() {
  const [history, setHistory] = useState<AIHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(() => {
    setIsLoading(true);
    try {
      const items = aiService.getHistory();
      setHistory(items);
    } catch (e) {
      console.error('History load error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const deleteItem = useCallback(
    (id: string) => {
      aiService.deleteHistoryItem(id);
      loadHistory();
    },
    [loadHistory]
  );

  const clearHistory = useCallback(() => {
    aiService.clearHistory();
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    refreshHistory: loadHistory,
    deleteItem,
    clearHistory,
  };
}
