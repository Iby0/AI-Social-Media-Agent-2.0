import { postService } from '../../database/services/postService';
import { logService } from '../../database/services/logService';
import { PostRecord, ContentPostStatus } from '../../database/types';
import { normalizePostStatus } from './content.utils';
import { validatePostContent, ValidationResult } from './content.validation';

export interface ContentFilterOptions {
  status?: string;
  category?: string;
  platform?: string;
  searchQuery?: string;
  sortBy?: 'newest' | 'oldest' | 'title';
}

export class ContentService {
  /**
   * Create a new post in IndexedDB
   */
  async createPost(
    postData: Partial<PostRecord> & { title: string; caption: string }
  ): Promise<{ post: PostRecord; validation: ValidationResult }> {
    const validation = validatePostContent(postData);

    const now = new Date().toISOString();
    const status = normalizePostStatus(postData.status || 'Draft');

    const newPost: PostRecord = {
      id: postData.id || `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: postData.userId || 'usr_default',
      title: postData.title.trim(),
      caption: postData.caption.trim(),
      description: postData.description || postData.caption,
      content: postData.caption,
      hashtags: postData.hashtags || [],
      platform: postData.platform || 'all',
      mediaIds: postData.mediaIds || [],
      image: postData.image || '',
      status: status,
      category: postData.category || 'Technology',
      createdAt: postData.createdAt || now,
      updatedAt: now,
      scheduledAt: postData.scheduledAt,
      publishedAt: postData.publishedAt,
    };

    const saved = await postService.save(newPost);

    try {
      await logService.addLog({
        message: `Created post "${saved.title}" in category "${saved.category}"`,
        type: 'post',
        status: 'info',
      });
    } catch {
      // Non-blocking log failure
    }

    return { post: saved, validation };
  }

  /**
   * Retrieve all posts with optional filtering, search and sorting
   */
  async getPosts(options: ContentFilterOptions = {}): Promise<PostRecord[]> {
    let posts = await postService.getAll();

    // Map/normalize status across legacy records
    posts = posts.map((p) => ({
      ...p,
      status: normalizePostStatus(p.status),
      category: p.category || 'Technology',
      hashtags: p.hashtags || [],
      mediaIds: p.mediaIds || [],
    }));

    // Status Filter
    if (options.status && options.status !== 'All') {
      const targetStatus = options.status.toLowerCase();
      posts = posts.filter((p) => p.status.toLowerCase() === targetStatus);
    }

    // Category Filter
    if (options.category && options.category !== 'All') {
      posts = posts.filter((p) => p.category?.toLowerCase() === options.category?.toLowerCase());
    }

    // Platform Filter
    if (options.platform && options.platform !== 'All') {
      posts = posts.filter(
        (p) => p.platform === 'all' || p.platform.toLowerCase() === options.platform?.toLowerCase()
      );
    }

    // Search Query Filter (Title, Caption, Category, Platform, Hashtags, Date)
    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      posts = posts.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const captionMatch = p.caption.toLowerCase().includes(q);
        const categoryMatch = (p.category || '').toLowerCase().includes(q);
        const platformMatch = p.platform.toLowerCase().includes(q);
        const hashtagMatch = (p.hashtags || []).some((h) => h.toLowerCase().includes(q));
        const dateMatch = new Date(p.createdAt).toLocaleDateString().includes(q);
        return titleMatch || captionMatch || categoryMatch || platformMatch || hashtagMatch || dateMatch;
      });
    }

    // Sorting
    const sortBy = options.sortBy || 'newest';
    posts.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return posts;
  }

  /**
   * Get single post by ID
   */
  async getPostById(id: string): Promise<PostRecord | null> {
    const post = await postService.getById(id);
    if (!post) return null;
    return {
      ...post,
      status: normalizePostStatus(post.status),
      category: post.category || 'Technology',
      hashtags: post.hashtags || [],
      mediaIds: post.mediaIds || [],
    };
  }

  /**
   * Update existing post
   */
  async updatePost(
    id: string,
    updates: Partial<PostRecord>
  ): Promise<{ post: PostRecord; validation: ValidationResult }> {
    const existing = await this.getPostById(id);
    if (!existing) {
      throw new Error(`Post with ID ${id} not found.`);
    }

    const merged: PostRecord = {
      ...existing,
      ...updates,
      status: updates.status ? normalizePostStatus(updates.status) : existing.status,
      updatedAt: new Date().toISOString(),
    };

    const validation = validatePostContent(merged);
    const saved = await postService.save(merged);

    try {
      await logService.addLog({
        message: `Updated post "${saved.title}" (Status: ${saved.status})`,
        type: 'post',
        status: 'info',
      });
    } catch {
      // Ignore
    }

    return { post: saved, validation };
  }

  /**
   * Update post status only
   */
  async updateStatus(id: string, newStatus: ContentPostStatus): Promise<PostRecord> {
    const { post } = await this.updatePost(id, { status: newStatus });
    return post;
  }

  /**
   * Duplicate post
   */
  async duplicatePost(id: string): Promise<PostRecord> {
    const existing = await this.getPostById(id);
    if (!existing) {
      throw new Error(`Post with ID ${id} not found.`);
    }

    const dupData: Partial<PostRecord> & { title: string; caption: string } = {
      ...existing,
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${existing.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { post } = await this.createPost(dupData);
    return post;
  }

  /**
   * Delete post by ID
   */
  async deletePost(id: string): Promise<void> {
    const existing = await this.getPostById(id);
    await postService.delete(id);

    try {
      await logService.addLog({
        message: `Deleted post "${existing?.title || id}"`,
        type: 'post',
        status: 'warning',
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Search posts helper
   */
  async searchPosts(query: string, filters?: ContentFilterOptions): Promise<PostRecord[]> {
    return this.getPosts({ ...filters, searchQuery: query });
  }

  /**
   * Aggregated Post Metrics
   */
  async getPostStats(): Promise<{
    total: number;
    drafts: number;
    review: number;
    ready: number;
    scheduled: number;
    published: number;
    failed: number;
    archived: number;
  }> {
    const posts = await this.getPosts();
    const stats = {
      total: posts.length,
      drafts: 0,
      review: 0,
      ready: 0,
      scheduled: 0,
      published: 0,
      failed: 0,
      archived: 0,
    };

    posts.forEach((p) => {
      const s = normalizePostStatus(p.status);
      switch (s) {
        case 'Draft':
          stats.drafts++;
          break;
        case 'Review':
          stats.review++;
          break;
        case 'Ready':
          stats.ready++;
          break;
        case 'Scheduled':
          stats.scheduled++;
          break;
        case 'Publishing':
        case 'Published':
          stats.published++;
          break;
        case 'Failed':
          stats.failed++;
          break;
        case 'Archived':
          stats.archived++;
          break;
      }
    });

    return stats;
  }
}

export const contentService = new ContentService();
