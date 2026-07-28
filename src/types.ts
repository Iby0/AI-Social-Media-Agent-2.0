export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'github';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'archived';

export type ToneOfVoice =
  | 'Professional'
  | 'Casual & Friendly'
  | 'Developer / Technical'
  | 'Creative & Inspirational'
  | 'Promotional & Energetic'
  | 'Humorous & Witty';

export interface PlatformCaptionMap {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

export interface Post {
  id: string;
  title: string;
  topic: string;
  tone: ToneOfVoice;
  audience: string;
  captions: PlatformCaptionMap;
  hashtags: string[];
  imagePrompt?: string;
  imageUrl?: string;
  selectedPlatforms: SocialPlatform[];
  status: PostStatus;
  scheduledAt?: string; // ISO string
  publishedAt?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  metrics?: {
    impressions?: number;
    likes?: number;
    shares?: number;
    comments?: number;
    clicks?: number;
  };
}

export interface SocialChannel {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  handle: string;
  avatarUrl?: string;
  isConnected: boolean;
  accessToken?: string;
  pageOrRepoId?: string;
  autoPublish: boolean;
  lastSyncedAt?: string;
  followerCount: number;
  status: 'active' | 'token_expired' | 'disconnected';
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  topic: string;
  tone: ToneOfVoice;
  audience: string;
  callToAction: string;
  hashtags: string[];
  createdAt: string;
}

export interface AnalyticsMetric {
  id: string;
  date: string; // YYYY-MM-DD
  platform: SocialPlatform;
  impressions: number;
  engagement: number;
  likes: number;
  shares: number;
  comments: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'ai' | 'channel' | 'post' | 'system' | 'backup';
  details: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

export interface BackupSettings {
  useSupabaseBackup: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  autoSync: boolean;
  lastBackupAt?: string;
}

export interface AIGenerateRequest {
  topic: string;
  tone?: ToneOfVoice;
  audience?: string;
  callToAction?: string;
  platforms?: SocialPlatform[];
  includeHashtags?: boolean;
  customInstructions?: string;
}

export interface AIGenerateResponse {
  title: string;
  captions: Record<SocialPlatform, string>;
  hashtags: string[];
  suggestedImagePrompt: string;
  summaryKeyPoints?: string[];
}
