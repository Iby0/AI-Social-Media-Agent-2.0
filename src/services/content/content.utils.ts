import { ContentPostStatus } from '../../database/types';

export interface PlatformLimit {
  maxChars: number;
  maxHashtags: number;
  maxMedia: number;
  name: string;
}

export const PLATFORM_LIMITS: Record<string, PlatformLimit> = {
  facebook: {
    name: 'Facebook',
    maxChars: 63206,
    maxHashtags: 30,
    maxMedia: 10,
  },
  instagram: {
    name: 'Instagram',
    maxChars: 2200,
    maxHashtags: 30,
    maxMedia: 10,
  },
  linkedin: {
    name: 'LinkedIn',
    maxChars: 3000,
    maxHashtags: 20,
    maxMedia: 9,
  },
  twitter: {
    name: 'Twitter / X',
    maxChars: 280,
    maxHashtags: 10,
    maxMedia: 4,
  },
  all: {
    name: 'Cross-Platform',
    maxChars: 280, // Restrictive limit for cross-platform compliance
    maxHashtags: 10,
    maxMedia: 4,
  },
};

export const CONTENT_CATEGORIES = [
  'Technology',
  'Business',
  'Education',
  'Marketing',
  'Personal',
  'Announcement',
  'Custom Category',
] as const;

export type ContentCategoryType = (typeof CONTENT_CATEGORIES)[number] | string;

export interface StatusMeta {
  label: string;
  description: string;
  badgeClass: string;
  dotColor: string;
}

export const STATUS_DEFINITIONS: Record<ContentPostStatus, StatusMeta> = {
  Draft: {
    label: 'Draft',
    description: 'Initial post idea or active workspace edit; not ready for publishing.',
    badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    dotColor: 'bg-slate-400',
  },
  Review: {
    label: 'Review',
    description: 'Content complete and awaiting peer approval or compliance check.',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotColor: 'bg-amber-400',
  },
  Ready: {
    label: 'Ready',
    description: 'Approved and finalized content queued for scheduling or manual posting.',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotColor: 'bg-emerald-400',
  },
  Scheduled: {
    label: 'Scheduled',
    description: 'Assigned to a future release date and time slot in the calendar queue.',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotColor: 'bg-blue-400',
  },
  Publishing: {
    label: 'Publishing',
    description: 'Currently actively executing network API request to publish post.',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    dotColor: 'bg-indigo-400',
  },
  Published: {
    label: 'Published',
    description: 'Successfully transmitted and verified live on target social account feed.',
    badgeClass: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    dotColor: 'bg-teal-400',
  },
  Failed: {
    label: 'Failed',
    description: 'Encountered network error, rate limit, or invalid token during dispatch.',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dotColor: 'bg-rose-500',
  },
  Archived: {
    label: 'Archived',
    description: 'Deprecated or stored content item removed from active views.',
    badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    dotColor: 'bg-zinc-500',
  },
};

/**
  * Parse raw text string into cleaned array of hashtag strings
  */
export function parseHashtags(input: string): string[] {
  if (!input) return [];
  const matches = input.match(/#[\w\u0590-\u05ff]+/g) || [];
  if (matches.length > 0) {
    return Array.from(new Set(matches.map((tag) => tag.replace('#', ''))));
  }
  return Array.from(
    new Set(
      input
        .split(/[,; ]+/)
        .map((t) => t.trim().replace(/^#/, ''))
        .filter((t) => t.length > 0)
    )
  );
}

/**
  * Format array of hashtag strings into #tag #tag string
  */
export function formatHashtagString(hashtags: string[] = []): string {
  return hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ');
}

/**
  * Normalizes legacy status strings ('draft', 'scheduled') to official ContentPostStatus ('Draft', 'Scheduled')
  */
export function normalizePostStatus(status: string): ContentPostStatus {
  if (!status) return 'Draft';
  const lower = status.toLowerCase();
  switch (lower) {
    case 'draft':
      return 'Draft';
    case 'review':
      return 'Review';
    case 'ready':
      return 'Ready';
    case 'scheduled':
      return 'Scheduled';
    case 'publishing':
      return 'Publishing';
    case 'published':
      return 'Published';
    case 'failed':
      return 'Failed';
    case 'archived':
      return 'Archived';
    default:
      return 'Draft';
  }
}
