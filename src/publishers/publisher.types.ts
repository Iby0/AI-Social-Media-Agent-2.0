export type SocialPlatformType =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'twitter'
  | 'threads'
  | 'telegram'
  | 'wordpress';

export type PublishVisibility = 'public' | 'private' | 'connections' | 'unlisted';

export interface PublishMediaItem {
  url: string;
  type: 'image' | 'video' | 'gif';
  aspectRatio?: string;
  altText?: string;
  sizeBytes?: number;
}

export interface PublishRequest {
  id: string;
  postId: string;
  postTitle: string;
  platform: SocialPlatformType;
  caption: string;
  media?: PublishMediaItem[];
  hashtags?: string[];
  ctaUrl?: string;
  visibility?: PublishVisibility;
  publishTime?: string;
  retryCount: number;
  maxRetries?: number;
  scheduledAt?: string;
  accountToken?: string;
  accountId?: string;
}

export interface PublishResponse {
  success: boolean;
  platformPostId?: string;
  platformUrl?: string;
  publishedTime: string;
  responseCode: number;
  errorMessage?: string;
  rawResponse?: Record<string, any>;
  durationMs: number;
}

export interface PlatformLimitConfig {
  maxCaptionLength: number;
  maxHashtags: number;
  supportedMediaTypes: ('image' | 'video' | 'gif')[];
  maxMediaSizeMB: number;
  supportsMultipleImages: boolean;
  supportsCTA: boolean;
  requiresMedia: boolean;
}

export interface PlatformValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PublishHistoryRecord {
  id: string;
  requestId: string;
  postId: string;
  postTitle: string;
  platform: SocialPlatformType;
  result: PublishResponse;
  publishedTime: string;
  durationMs: number;
  retryCount: number;
  accountName?: string;
}
