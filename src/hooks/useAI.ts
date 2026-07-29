import { useState, useCallback } from 'react';
import { AIInputModel, AIOutputModel, AIRateLimitStatus } from '../types/ai';
import { aiService } from '../services/ai/ai.service';

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOutput, setLastOutput] = useState<AIOutputModel | null>(null);
  const [isCachedResult, setIsCachedResult] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState<AIRateLimitStatus>(() =>
    aiService.getRateLimitStatus()
  );

  const refreshRateLimit = useCallback(() => {
    setRateLimitStatus(aiService.getRateLimitStatus());
  }, []);

  const generateContent = useCallback(
    async (input: AIInputModel, bypassCache = false) => {
      setIsGenerating(true);
      setError(null);
      setIsCachedResult(false);

      try {
        const { result, cached } = await aiService.generateContent(input, bypassCache);
        setLastOutput(result);
        setIsCachedResult(cached);
        refreshRateLimit();
        return result;
      } catch (err: any) {
        const msg = err.message || 'An unexpected error occurred during AI generation.';
        setError(msg);
        refreshRateLimit();
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [refreshRateLimit]
  );

  return {
    isGenerating,
    error,
    lastOutput,
    isCachedResult,
    rateLimitStatus,
    generateContent,
    refreshRateLimit,
    clearError: () => setError(null),
  };
}
