import { PLATFORM_LIMITS } from './content.utils';

export interface PostValidationInput {
  title?: string;
  caption?: string;
  description?: string;
  platform?: string;
  hashtags?: string[];
  mediaIds?: string[];
  category?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

export function validatePostContent(input: PostValidationInput): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  const title = (input.title || '').trim();
  const caption = (input.caption || '').trim();
  const platform = (input.platform || 'all').toLowerCase();
  const hashtags = input.hashtags || [];
  const mediaIds = input.mediaIds || [];

  // 1. Empty Content Check
  if (!title) {
    errors.title = 'Title is required for post identification.';
  }

  if (!caption) {
    errors.caption = 'Caption content cannot be blank.';
  }

  // 2. Character Limit Validation
  const platformLimit = PLATFORM_LIMITS[platform] || PLATFORM_LIMITS.all;
  if (caption.length > platformLimit.maxChars) {
    errors.caption = `Caption exceeds maximum length of ${platformLimit.maxChars.toLocaleString()} characters for ${platformLimit.name} (currently ${caption.length.toLocaleString()}).`;
  } else if (caption.length > platformLimit.maxChars * 0.9) {
    warnings.push(`Approaching character limit for ${platformLimit.name} (${caption.length}/${platformLimit.maxChars}).`);
  }

  // 3. Hashtag limit check
  if (hashtags.length > platformLimit.maxHashtags) {
    warnings.push(
      `Number of hashtags (${hashtags.length}) exceeds recommended max of ${platformLimit.maxHashtags} for ${platformLimit.name}.`
    );
  }

  // 4. Invalid Media Check
  if (mediaIds.length > platformLimit.maxMedia) {
    errors.media = `Selected platform (${platformLimit.name}) supports a maximum of ${platformLimit.maxMedia} attached media items. You attached ${mediaIds.length}.`;
  }

  // 5. Category Check
  if (!input.category || !input.category.trim()) {
    warnings.push('No category selected. Post will default to "Technology".');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}
