import { SocialPlatform } from '../database/types';

export type ImageType =
  | 'Facebook Post'
  | 'Instagram Square'
  | 'Instagram Story'
  | 'LinkedIn Banner'
  | 'GitHub Social Image'
  | 'Blog Cover'
  | 'Quote Card'
  | 'Announcement'
  | 'Marketing Banner'
  | 'Technology Illustration';

export type ImageStyle =
  | 'Minimal'
  | 'Corporate'
  | 'Modern'
  | 'Technology'
  | 'Professional'
  | 'Creative'
  | 'Dark'
  | 'Light'
  | 'Gradient'
  | 'Flat Design';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '4:1' | '3:2';

export type LogoPosition = 'none' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface ImageInputModel {
  platform: SocialPlatform;
  imageType: ImageType;
  topic: string;
  caption?: string;
  keywords?: string[];
  style: ImageStyle;
  aspectRatio: AspectRatio;
  language: string;
  brandColors?: string[];
  logoPosition?: LogoPosition;
  backgroundPreference?: string;
  customPrompt?: string;
  negativePrompt?: string;
}

export interface ImageOutputModel {
  id: string;
  imageUrl: string;
  promptUsed: string;
  negativePrompt: string;
  dimensions: { width: number; height: number };
  imageSize: number; // Size in bytes
  generationTimeMs: number;
  provider: string;
  createdAt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  platform: SocialPlatform;
  imageType: ImageType;
  mediaLibraryId?: string;
}

export interface ImagePromptTemplate {
  id: string;
  name: string;
  description: string;
  style: ImageStyle;
  imageType: ImageType;
  promptTemplate: string;
  negativePromptTemplate: string;
}

export interface ImageCacheEntry {
  key: string;
  inputHash: string;
  input: ImageInputModel;
  output: ImageOutputModel;
  timestamp: string;
  expiresAt: string;
}

export interface ImageAIValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImageAISettings {
  defaultProvider: string;
  defaultStyle: ImageStyle;
  defaultAspectRatio: AspectRatio;
  enableCache: boolean;
  autoSaveToMediaLibrary: boolean;
  timeoutMs: number;
}
