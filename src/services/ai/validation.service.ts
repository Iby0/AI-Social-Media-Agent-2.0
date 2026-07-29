import { AIInputModel, ValidationResult } from '../../types/ai';

export const PLATFORM_LIMITS: Record<string, { maxChars: number; maxHashtags: number; supportsMarkdown: boolean }> = {
  facebook: { maxChars: 63206, maxHashtags: 10, supportsMarkdown: false },
  instagram: { maxChars: 2200, maxHashtags: 30, supportsMarkdown: false },
  linkedin: { maxChars: 3000, maxHashtags: 10, supportsMarkdown: false },
  github: { maxChars: 65536, maxHashtags: 15, supportsMarkdown: true },
  twitter: { maxChars: 280, maxHashtags: 5, supportsMarkdown: false },
  threads: { maxChars: 500, maxHashtags: 10, supportsMarkdown: false },
  telegram: { maxChars: 4096, maxHashtags: 20, supportsMarkdown: true },
  wordpress: { maxChars: 100000, maxHashtags: 30, supportsMarkdown: true },
};

export class ValidationService {
  public validateInput(input: AIInputModel): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Topic or Existing Content check depending on feature
    const requiresExistingContent = [
      'improver',
      'rewriter',
      'grammar',
      'tone_changer',
      'expander',
      'shortener',
    ].includes(input.feature);

    if (requiresExistingContent) {
      if (!input.existingContent || input.existingContent.trim().length === 0) {
        errors.push(`Text content is required for "${input.feature.replace('_', ' ')}".`);
      } else if (input.existingContent.trim().length < 5) {
        errors.push('Content is too short (minimum 5 characters).');
      }
    } else {
      if (!input.topic || input.topic.trim().length === 0) {
        errors.push('Topic or content description is required.');
      } else if (input.topic.trim().length < 3) {
        errors.push('Topic must be at least 3 characters long.');
      }
    }

    // 2. Maximum input length limit
    const fullText = (input.topic || '') + (input.existingContent || '');
    if (fullText.length > 10000) {
      errors.push('Input text exceeds maximum length of 10,000 characters.');
    }

    // 3. Platform Limits check
    const platformConfig = PLATFORM_LIMITS[input.platform.toLowerCase()] || PLATFORM_LIMITS['linkedin'];
    if (input.hashtagCount && input.hashtagCount > platformConfig.maxHashtags) {
      warnings.push(
        `${input.platform} recommends maximum ${platformConfig.maxHashtags} hashtags. Specified ${input.hashtagCount}.`
      );
    }

    // 4. Invalid Control Characters
    const hasUnprintable = /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(fullText);
    if (hasUnprintable) {
      warnings.push('Input contains unprintable control characters which will be sanitized.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  public sanitizeText(text: string): string {
    return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
  }

  public calculateReadingTime(text: string): string {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    if (minutes < 1) {
      const seconds = Math.max(10, Math.ceil((wordCount / wordsPerMinute) * 60));
      return `${seconds} sec read`;
    }
    return `${minutes} min read`;
  }
}

export const validationService = new ValidationService();
