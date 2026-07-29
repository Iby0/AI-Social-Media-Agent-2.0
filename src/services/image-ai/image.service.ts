import { ImageInputModel, ImageOutputModel } from '../../types/image-ai';

import { imageValidationService } from './validation';
import { promptBuilderService } from './prompt-builder';
import { imageCacheService } from './image-cache';
import { imageProviderRegistry } from './provider.service';
import { mediaService } from '../../database/services/mediaService';
import { logService } from '../../database/services/logService';

const HISTORY_STORAGE_KEY = 'ai_image_generation_history_v1';

export class ImageAIService {
  public async generateImage(
    input: ImageInputModel,
    useCache: boolean = true
  ): Promise<ImageOutputModel> {
    // 1. Validate Input
    const validation = imageValidationService.validateInput(input);
    if (!validation.isValid) {
      throw new Error(`Validation Error: ${validation.errors.join(' ')}`);
    }

    // 2. Check Cache
    if (useCache) {
      const cached = imageCacheService.get(input);
      if (cached) {
        await logService.log(`AI Image Cache Hit for ${input.topic || input.imageType}`, 'user', 'info');
        return cached;
      }
    }

    // 3. Build Prompts
    const { prompt, negativePrompt } = promptBuilderService.buildPrompt(input);

    // 4. Select Provider
    const provider = imageProviderRegistry.getProvider();

    // 5. Generate Image
    let output: ImageOutputModel;
    try {
      output = await provider.generateImage(input, prompt, negativePrompt);
    } catch (err: any) {
      await logService.log(`AI Image Generation Failed: ${err.message}`, 'error', 'error');
      throw err;
    }

    // 6. Automatically Save to Media Library (Module 08 Integration)
    try {
      const fileName = `${input.platform}_${input.imageType.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const mediaRecord = await mediaService.save({
        id: output.id,
        fileName,
        fileType: 'image/png',
        fileSize: output.imageSize,
        fileData: output.imageUrl,
        thumbnail: output.imageUrl,
        category: 'AI Generated',
        source: 'ai_studio',
        dimensions: output.dimensions,
        createdAt: output.createdAt,
      });
      output.mediaLibraryId = mediaRecord.id;
    } catch (mediaErr) {
      console.warn('Failed to auto-save generated image to Media Library:', mediaErr);
    }

    // 7. Store in Cache
    if (useCache) {
      imageCacheService.set(input, output);
    }

    // 8. Save to Local History
    await this.saveToHistory(output);

    // 9. Log Activity
    await logService.log(
      `AI Image Generated (${input.imageType} - ${input.platform})`,
      'user',
      'success'
    );

    return output;
  }

  public async getHistory(): Promise<ImageOutputModel[]> {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const list: ImageOutputModel[] = JSON.parse(raw);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  public async saveToHistory(item: ImageOutputModel): Promise<void> {
    try {
      const history = await this.getHistory();
      // Keep max 50 items
      const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 50);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to image generation history:', e);
    }
  }

  public async deleteHistoryItem(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updated = history.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete history item:', e);
    }
  }

  public async clearHistory(): Promise<void> {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  }
}

export const imageAIService = new ImageAIService();
