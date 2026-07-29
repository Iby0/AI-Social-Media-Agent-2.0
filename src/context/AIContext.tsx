import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AIInputModel,
  AIOutputModel,
  AIRateLimitStatus,
  AISettingsModel,
  AIHistoryItem,
  SupportedLanguage,
  BrandVoiceTone,
  AIFeatureType,
  EmojiLevelOption,
} from '../types/ai';
import { SocialPlatform } from '../database/types';
import { aiService } from '../services/ai/ai.service';
import { cacheService } from '../services/ai/cache.service';

const SETTINGS_STORAGE_KEY = 'ai_settings_v1';

const DEFAULT_SETTINGS: AISettingsModel = {
  defaultLanguage: 'English',
  defaultTone: 'Professional',
  defaultPlatform: 'linkedin',
  defaultHashtagCount: 8,
  defaultEmojiLevel: 'medium',
  enableCache: true,
  dailyQuotaLimit: 50,
};

interface AIContextType {
  settings: AISettingsModel;
  updateSettings: (newSettings: Partial<AISettingsModel>) => void;
  history: AIHistoryItem[];
  refreshHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  rateLimitStatus: AIRateLimitStatus;
  refreshRateLimit: () => void;
  clearCache: () => void;
  cachedCount: number;
  generate: (input: AIInputModel, bypassCache?: boolean) => Promise<{ result: AIOutputModel; cached: boolean }>;
  isGenerating: boolean;
  activeFeature: AIFeatureType;
  setActiveFeature: (feature: AIFeatureType) => void;
  currentInput: AIInputModel;
  setCurrentInput: React.Dispatch<React.SetStateAction<AIInputModel>>;
  latestOutput: AIOutputModel | null;
  setLatestOutput: (output: AIOutputModel | null) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AISettingsModel>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [activeFeature, setActiveFeature] = useState<AIFeatureType>('caption');
  const [history, setHistory] = useState<AIHistoryItem[]>([]);
  const [rateLimitStatus, setRateLimitStatus] = useState<AIRateLimitStatus>(() =>
    aiService.getRateLimitStatus()
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [latestOutput, setLatestOutput] = useState<AIOutputModel | null>(null);
  const [cachedCount, setCachedCount] = useState(0);

  const [currentInput, setCurrentInput] = useState<AIInputModel>({
    feature: 'caption',
    platform: settings.defaultPlatform,
    language: settings.defaultLanguage,
    topic: '',
    existingContent: '',
    tone: settings.defaultTone,
    targetAudience: 'General Community',
    contentType: 'Technology',
    contentLength: 'medium',
    ctaRequired: true,
    hashtagCount: settings.defaultHashtagCount,
    emojiLevel: settings.defaultEmojiLevel,
    customInstructions: '',
  });

  const loadHistory = () => {
    setHistory(aiService.getHistory());
  };

  const refreshRateLimit = () => {
    setRateLimitStatus(aiService.getRateLimitStatus());
  };

  const updateCachedCount = () => {
    setCachedCount(cacheService.getCacheCount());
  };

  useEffect(() => {
    loadHistory();
    refreshRateLimit();
    updateCachedCount();
  }, []);

  const updateSettings = (newSettings: Partial<AISettingsModel>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist AI settings:', e);
    }
  };

  const generate = async (input: AIInputModel, bypassCache = false) => {
    setIsGenerating(true);
    try {
      const { result, cached } = await aiService.generateContent(input, bypassCache || !settings.enableCache);
      setLatestOutput(result);
      loadHistory();
      refreshRateLimit();
      updateCachedCount();
      return { result, cached };
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    aiService.deleteHistoryItem(id);
    loadHistory();
  };

  const clearHistory = () => {
    aiService.clearHistory();
    loadHistory();
  };

  const clearCache = () => {
    cacheService.clearAllCache();
    updateCachedCount();
  };

  return (
    <AIContext.Provider
      value={{
        settings,
        updateSettings,
        history,
        refreshHistory: loadHistory,
        deleteHistoryItem,
        clearHistory,
        rateLimitStatus,
        refreshRateLimit,
        clearCache,
        cachedCount,
        generate,
        isGenerating,
        activeFeature,
        setActiveFeature,
        currentInput,
        setCurrentInput,
        latestOutput,
        setLatestOutput,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  return context;
};
