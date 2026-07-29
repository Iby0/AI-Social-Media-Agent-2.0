import { useState, useEffect, useCallback } from 'react';
import { PublishHistoryRecord } from '../publishers/publisher.types';
import { HistoryService } from '../services/publishing/history.service';

export function usePublishHistory() {
  const [history, setHistory] = useState<PublishHistoryRecord[]>([]);

  const refreshHistory = useCallback(() => {
    const records = HistoryService.getHistory();
    setHistory(records);
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const clearHistory = useCallback(() => {
    HistoryService.clearHistory();
    setHistory([]);
  }, []);

  return {
    history,
    refreshHistory,
    clearHistory,
  };
}
