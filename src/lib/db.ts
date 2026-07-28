import { Post, SocialChannel, PromptTemplate, AnalyticsMetric, ActivityLog, BackupSettings, SocialPlatform, PostStatus } from '../types';
import {
  postService,
  logService,
  settingService,
  socialAccountService,
  exportDatabaseJSON,
  importDatabaseJSON,
} from '../database';

class IndexedDBEngineAdapter {
  // Posts
  async getAllPosts(): Promise<Post[]> {
    const list = await postService.getAll();
    return list.map((p) => ({
      id: p.id,
      title: p.title,
      topic: p.caption || 'General',
      tone: 'Professional',
      audience: 'General',
      captions: { facebook: p.caption, linkedin: p.caption },
      hashtags: ['#AI', '#SocialMedia'],
      imageUrl: p.image,
      selectedPlatforms: [p.platform as SocialPlatform],
      status: p.status as PostStatus,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  async savePost(post: Post): Promise<void> {
    await postService.save({
      id: post.id,
      title: post.title,
      caption: post.captions?.linkedin || post.topic || '',
      content: post.captions?.linkedin || '',
      platform: post.selectedPlatforms?.[0] || 'linkedin',
      status: (post.status === 'failed' ? 'draft' : post.status) as 'draft' | 'scheduled' | 'published' | 'archived',
      image: post.imageUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  }

  async deletePost(id: string): Promise<void> {
    await postService.delete(id);
  }

  // Channels
  async getAllChannels(): Promise<SocialChannel[]> {
    const list = await socialAccountService.getAll();
    return list.map((c) => ({
      id: c.id,
      platform: (['facebook', 'instagram', 'linkedin', 'github'].includes(c.platform) ? c.platform : 'linkedin') as SocialPlatform,
      accountName: c.accountName || c.username || 'Account',
      handle: c.accountName || c.username || 'handle',
      isConnected: c.status === 'Connected' || c.status === 'connected',
      autoPublish: false,
      followerCount: 1200,
      status: c.status === 'Connected' || c.status === 'connected' ? 'active' : 'disconnected',
    }));
  }

  async saveChannel(channel: SocialChannel): Promise<void> {
    await socialAccountService.save({
      id: channel.id,
      platform: channel.platform,
      accountName: channel.accountName || channel.handle,
      username: channel.handle || channel.accountName,
      accountId: `acc_${channel.id}`,
      status: channel.isConnected ? 'Connected' : 'Disconnected',
    });
  }

  // Templates
  async getAllTemplates(): Promise<PromptTemplate[]> {
    return [
      {
        id: 'tpl_1',
        name: 'Product Announcement',
        description: 'Template for new feature launches',
        topic: 'Product Launch',
        tone: 'Professional',
        audience: 'Customers',
        callToAction: 'Check it out now!',
        hashtags: ['#Launch', '#Update'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'tpl_2',
        name: 'Viral Engagement Hook',
        description: 'Interactive question for developer community',
        topic: 'Developer Question',
        tone: 'Developer / Technical',
        audience: 'Engineers',
        callToAction: 'Comment below!',
        hashtags: ['#DevRel', '#Coding'],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async saveTemplate(_template: PromptTemplate): Promise<void> {}

  async deleteTemplate(_id: string): Promise<void> {}

  // Analytics
  async getAllAnalytics(): Promise<AnalyticsMetric[]> {
    return [
      { id: 'a1', date: '2026-02-15', platform: 'linkedin', impressions: 1250, engagement: 8.5, likes: 98, shares: 14, comments: 12 },
      { id: 'a2', date: '2026-02-15', platform: 'facebook', impressions: 3400, engagement: 6.2, likes: 210, shares: 45, comments: 28 },
    ];
  }

  async saveAnalytics(_metrics: AnalyticsMetric[]): Promise<void> {}

  // Logs
  async getAllLogs(): Promise<ActivityLog[]> {
    const list = await logService.getAll();
    return list.map((l) => ({
      id: l.id,
      timestamp: l.createdAt,
      action: l.type.toUpperCase(),
      category: (['ai', 'channel', 'post', 'system', 'backup'].includes(l.type) ? l.type : 'system') as ActivityLog['category'],
      details: l.message,
      status: (['success', 'warning', 'info', 'error'].includes(l.status) ? l.status : 'info') as ActivityLog['status'],
    }));
  }

  async logActivity(
    action: string,
    category: ActivityLog['category'],
    details: string,
    status: ActivityLog['status'] = 'info'
  ): Promise<void> {
    await logService.log(`[${action}] ${details}`, (category === 'ai' ? 'user' : category === 'channel' ? 'channel' : 'system') as any, status);
  }

  // Settings & Backup
  async getSettings(): Promise<BackupSettings | null> {
    const s = await settingService.getSettings();
    return {
      useSupabaseBackup: false,
      supabaseUrl: '',
      supabaseAnonKey: '',
      autoSync: s.autoCleanup,
      lastBackupAt: new Date().toISOString(),
    };
  }

  async saveSettings(_settings: BackupSettings): Promise<void> {
    await settingService.saveSettings({ autoCleanup: _settings.autoSync });
  }

  async exportDatabaseJSON(): Promise<string> {
    return exportDatabaseJSON();
  }

  async importDatabaseJSON(jsonStr: string): Promise<void> {
    await importDatabaseJSON(jsonStr);
  }
}

export const db = new IndexedDBEngineAdapter();

export * from '../database';
