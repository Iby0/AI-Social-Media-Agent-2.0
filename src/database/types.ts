export type DataLifecycleState = 'Created' | 'Updated' | 'Archived' | 'Deleted';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostRecord {
  id: string;
  title: string;
  caption: string;
  content: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  image?: string;
  createdAt: string;
  updatedAt: string;
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

export interface SettingRecord {
  id: string; // Key, e.g., 'app_settings'
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  storageLimit: number; // in MB (e.g. 500)
  autoCleanup: boolean;
}

export interface LogRecord {
  id: string;
  type: 'system' | 'user' | 'post' | 'channel' | 'backup' | 'error';
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
}

export interface SocialAccountRecord {
  id: string;
  platform: string;
  username: string;
  status: 'connected' | 'disconnected' | 'expired';
  connectedAt: string;
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
