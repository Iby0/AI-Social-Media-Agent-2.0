export type DataLifecycleState = 'Created' | 'Updated' | 'Archived' | 'Deleted';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContentPostStatus =
  | 'Draft'
  | 'Review'
  | 'Ready'
  | 'Scheduled'
  | 'Publishing'
  | 'Published'
  | 'Failed'
  | 'Archived';

export interface PostRecord {
  id: string;
  userId?: string;
  title: string;
  caption: string;
  description?: string;
  content?: string;
  hashtags?: string[];
  platform: string; // 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'all'
  mediaIds?: string[];
  image?: string;
  status: ContentPostStatus | 'draft' | 'scheduled' | 'published' | 'archived' | 'failed';
  category?: string;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  publishedAt?: string;
}

export interface ScheduleRecord {
  id: string;
  postId: string;
  platform: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
}

export type MediaCategory = 'Uploaded Image' | 'AI Generated' | 'Post Image' | 'Temporary File';
export type MediaSource = 'user_upload' | 'ai_studio' | 'post_attachment' | 'temp';

export interface MediaRecord {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData: string; // Base64 or Blob URL data
  thumbnail?: string; // Compact thumbnail data URL
  category?: MediaCategory;
  source?: MediaSource;
  dimensions?: { width: number; height: number };
  createdAt: string;
  updatedAt?: string;
}

export type ThemeOption = 'light' | 'dark' | 'system';
export type LanguageOption = 'EN' | 'BN';
export type DateFormatOption = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
export type TimeFormatOption = '12h' | '24h';
export type CleanupFrequencyOption = 'daily' | 'weekly' | 'monthly' | 'never';

export interface NotificationPreferences {
  enabled: boolean;
  postReminder: boolean;
  scheduleReminder: boolean;
  systemAlerts: boolean;
}

export interface UserSettings {
  id: string; // Key, e.g., 'app_settings'
  userId: string;
  theme: ThemeOption;
  language: LanguageOption;
  timezone: string;
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  notifications: NotificationPreferences;
  storageLimit: number; // in MB (e.g. 500)
  autoCleanup: boolean;
  cleanupFrequency: CleanupFrequencyOption;
  createdAt: string;
  updatedAt: string;
}

export interface SettingRecord extends UserSettings {}

export interface LogRecord {
  id: string;
  type: 'system' | 'user' | 'post' | 'channel' | 'backup' | 'error';
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
}

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'github' | string;
export type SocialAccountStatus = 'Connected' | 'Disconnected' | 'Expired' | 'Error' | 'Pending';
export type AccountHealthLevel = 'Excellent' | 'Good' | 'Warning' | 'Critical' | 'Offline';
export type TokenState = 'Valid' | 'Expiring Soon' | 'Expired' | 'Refresh Required' | 'Disconnected';

export interface ConnectionHistoryItem {
  id: string;
  accountId?: string;
  platform: SocialPlatform;
  action: 'Connect' | 'Reconnect' | 'Disconnect' | 'Refresh Token' | 'Health Check' | 'Rename' | 'Toggle State' | 'Permission Sync';
  time: string;
  status: 'Success' | 'Warning' | 'Error' | 'Info';
  result: string;
}

export interface SocialAccountRecord {
  id: string;
  userId?: string;
  platform: SocialPlatform;
  accountName: string;
  displayName?: string;
  username?: string; // Backwards compatibility alias
  accountId: string;
  accountType?: string; // e.g. "Facebook Page", "Instagram Business", "LinkedIn Member", "GitHub Developer"
  avatar?: string;
  email?: string;
  repositoriesCount?: number;
  headline?: string;
  bio?: string;
  status: SocialAccountStatus | 'connected' | 'disconnected' | 'expired' | 'error' | 'pending';
  healthLevel?: AccountHealthLevel;
  enabled?: boolean;
  lastSyncAt?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: string;
  permissions?: string[];
  connectedAt: string;
  updatedAt?: string;
  connectionHistory?: ConnectionHistoryItem[];
}

export interface StorageInfo {
  usedBytes: number;
  quotaBytes: number;
  usagePercentage: number;
  isWarning: boolean;
  isLimitExceeded: boolean;
  usedFormatted: string;
  quotaFormatted: string;
}

export interface DatabaseBackupPayload {
  version: string;
  exportedAt: string;
  users: UserRecord[];
  posts: PostRecord[];
  schedules: ScheduleRecord[];
  media: MediaRecord[];
  settings: SettingRecord[];
  logs: LogRecord[];
  socialAccounts: SocialAccountRecord[];
}
