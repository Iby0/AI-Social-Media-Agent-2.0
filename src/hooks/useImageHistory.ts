import { useState, useEffect, useCallback } from 'react';
import { ImageOutputModel } from '../types/image-ai';
import { imageAIService } from '../services/image-ai/image.service';

export function useImageHistory() {
  const [history, setHistory] = useState<ImageOutputModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await imageAIService.getHistory();
      setHistory(items);
    } catch (e) {
      console.error('Failed to load image history:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    await imageAIService.deleteHistoryItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(async () => {
    await imageAIService.clearHistory();
    setHistory([]);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    loadHistory,
    deleteItem,
    clearHistory,
  };
}
