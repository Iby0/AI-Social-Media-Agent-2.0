import { SocialPlatform } from '../database/types';

export type AIFeatureType =
  | 'caption'
  | 'hashtag'
  | 'image_prompt'
  | 'title'
  | 'cta'
  | 'improver'
  | 'rewriter'
  | 'grammar'
  | 'tone_changer'
  | 'expander'
  | 'shortener';

export type SupportedLanguage = 'English' | 'Bangla' | 'Mixed Bengali + English' | 'Spanish' | 'French';

export type BrandVoiceTone =
  | 'Professional'
  | 'Friendly'
  | 'Corporate'
  | 'Technical'
  | 'Minimal'
  | 'Inspirational'
  | 'Casual'
  | 'Educational';

export type ContentTypeCategory =
  | 'Educational'
  | 'Technology'
  | 'Marketing'
  | 'Business'
  | 'Career'
  | 'Networking'
  | 'News'
  | 'Announcement'
  | 'Promotion'
  | 'Personal Branding'
  | 'Motivational'
  | 'Custom';

export type ContentLengthOption = 'short' | 'medium' | 'long';
export type EmojiLevelOption = 'none' | 'low' | 'medium' | 'high';

export interface AIInputModel {
  feature: AIFeatureType;
  platform: SocialPlatform;
  language: SupportedLanguage;
  topic?: string;
  existingContent?: string;
  keywords?: string[];
  targetAudience?: string;
  contentType?: ContentTypeCategory;
  tone?: BrandVoiceTone;
  contentLength?: ContentLengthOption;
  ctaRequired?: boolean;
  hashtagCount?: number;
  emojiLevel?: EmojiLevelOption;
  customInstructions?: string;
}

export interface AIOutputModel {
  title: string;
  caption: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
  seoKeywords: string[];
  estimatedReadingTime: string;
  characterCount: number;
  rawText?: string;
}

export interface PromptTemplateModel {
  id: string;
  name: string;
  description: string;
  feature: AIFeatureType;
  platform: SocialPlatform | 'all';
  template: string;
  placeholders: string[];
  version: number;
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AICacheEntry {
  key: string;
  inputHash: string;
  feature: AIFeatureType;
  platform: string;
  language: string;
  result: AIOutputModel;
  timestamp: string;
  expiresAt: string;
}

export interface AIHistoryItem {
  id: string;
  feature: AIFeatureType;
  platform: SocialPlatform;
  language: SupportedLanguage;
  input: AIInputModel;
  output: AIOutputModel;
  timestamp: string;
  cached?: boolean;
  provider?: string;
}

export interface AIRateLimitStatus {
  dailyLimit: number;
  dailyUsed: number;
  minuteLimit: number;
  minuteUsed: number;
  isCoolingDown: boolean;
  cooldownSeconds: number;
  quotaWarning: boolean;
}

export interface AISettingsModel {
  defaultLanguage: SupportedLanguage;
  defaultTone: BrandVoiceTone;
  defaultPlatform: SocialPlatform;
  defaultHashtagCount: number;
  defaultEmojiLevel: EmojiLevelOption;
  enableCache: boolean;
  dailyQuotaLimit: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
