/**
 * High-Level Media Service
 * Module 08 - Media Library & File Management System
 */

import { mediaService as dbMediaService } from '../../database/services/mediaService';
import { logService } from '../../database/services/logService';
import { MediaRecord, MediaCategory, MediaSource } from '../../database/types';
import { fileToBase64, generateThumbnail, compressImage, getImageDimensions } from './media.utils';
import { validateMediaFile, ValidationResult } from './media.validation';
import { getStorageMetrics } from '../../database/utils/storageMonitor';

export type MediaSortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'size_desc';

export class ExtendedMediaService {
  /**
   * Retrieves all media records sorted by creation date
   */
  async getAll(): Promise<MediaRecord[]> {
    return await dbMediaService.getAll();
  }

  /**
   * Retrieves a single media record by ID
   */
  async getById(id: string): Promise<MediaRecord | null> {
    return await dbMediaService.getById(id);
  }

  /**
   * Processes a newly selected/dropped File:
   * Validates -> Compresses -> Generates Thumbnail -> Gets Dimensions -> Saves to IndexedDB
   */
  async uploadFile(
    file: File,
    category: MediaCategory = 'Uploaded Image',
    source: MediaSource = 'user_upload'
  ): Promise<{ record: MediaRecord; validation: ValidationResult }> {
    const existing = await this.getAll();
    const validation = validateMediaFile(file, existing);

    if (!validation.isValid) {
      await logService.log(`Upload failed for file ${file.name}: ${validation.error}`, 'system', 'warning');
      return { record: null as any, validation };
    }

    // Convert file to raw Base64
    const rawBase64 = await fileToBase64(file);

    // Compress main image if large
    const optimizedBase64 = await compressImage(rawBase64, 1920, 0.85);

    // Generate thumbnail
    const thumbnailBase64 = await generateThumbnail(optimizedBase64, 320);

    // Get image dimensions
    const dimensions = await getImageDimensions(optimizedBase64);

    const now = new Date().toISOString();
    const record: MediaRecord = {
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fileName: file.name,
      fileType: file.type || 'image/png',
      fileSize: file.size,
      fileData: optimizedBase64,
      thumbnail: thumbnailBase64,
      category,
      source,
      dimensions,
      createdAt: now,
      updatedAt: now,
    };

    const saved = await dbMediaService.save(record);
    await logService.log(`Media uploaded: ${file.name} (${category})`, 'system', 'success');

    return { record: saved, validation };
  }

  /**
   * Deletes a media asset by ID
   */
  async delete(id: string): Promise<void> {
    const item = await this.getById(id);
    await dbMediaService.delete(id);
    if (item) {
      await logService.log(`Media deleted: ${item.fileName}`, 'system', 'info');
    }
  }

  /**
   * Filters, searches, and sorts media items in memory
   */
  filterAndSort(
    items: MediaRecord[],
    searchQuery: string = '',
    categoryFilter: string = 'All',
    sortBy: MediaSortOption = 'newest'
  ): MediaRecord[] {
    let result = [...items];

    // Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter((item) => {
        if (categoryFilter === 'Uploaded') return item.category === 'Uploaded Image';
        if (categoryFilter === 'Generated') return item.category === 'AI Generated';
        if (categoryFilter === 'Post Images') return item.category === 'Post Image';
        if (categoryFilter === 'Temporary') return item.category === 'Temporary File';
        return item.category === categoryFilter;
      });
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.fileName.toLowerCase().includes(q) ||
          item.fileType.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'name_asc') {
        return a.fileName.localeCompare(b.fileName);
      }
      if (sortBy === 'name_desc') {
        return b.fileName.localeCompare(a.fileName);
      }
      if (sortBy === 'size_desc') {
        return b.fileSize - a.fileSize;
      }
      return 0;
    });

    return result;
  }

  /**
   * Get storage metrics
   */
  async getStorageStats() {
    return await getStorageMetrics();
  }

  /**
   * Seeds sample media into IndexedDB if library is initially empty
   */
  async seedInitialMediaIfEmpty(): Promise<MediaRecord[]> {
    const existing = await this.getAll();
    if (existing.length > 0) return existing;

    const samples: Omit<MediaRecord, 'createdAt'>[] = [
      {
        id: 'med_sample_1',
        fileName: 'SaaS_Product_Showcase_Banner.png',
        fileType: 'image/png',
        fileSize: 1250000, // 1.25 MB
        fileData: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=350',
        category: 'Uploaded Image',
        source: 'user_upload',
        dimensions: { width: 1200, height: 630 },
      },
      {
        id: 'med_sample_2',
        fileName: 'AI_Code_Assistant_Preview.jpg',
        fileType: 'image/jpeg',
        fileSize: 850000,
        fileData: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=350',
        category: 'AI Generated',
        source: 'ai_studio',
        dimensions: { width: 1080, height: 1080 },
      },
      {
        id: 'med_sample_3',
        fileName: 'Modern_Developer_Workspace.jpg',
        fileType: 'image/jpeg',
        fileSize: 2100000,
        fileData: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=350',
        category: 'Post Image',
        source: 'post_attachment',
        dimensions: { width: 1920, height: 1080 },
      },
      {
        id: 'med_sample_4',
        fileName: 'Social_Media_Growth_Infographic.png',
        fileType: 'image/png',
        fileSize: 620000,
        fileData: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=350',
        category: 'Temporary File',
        source: 'temp',
        dimensions: { width: 800, height: 1200 },
      },
    ];

    for (const sample of samples) {
      await dbMediaService.save(sample);
    }

    return await this.getAll();
  }
}

export const mediaAppService = new ExtendedMediaService();
