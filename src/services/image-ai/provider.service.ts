import { ImageInputModel, ImageOutputModel } from '../../types/image-ai';

export interface ImageProviderAdapter {
  providerName: string;
  generateImage(input: ImageInputModel, prompt: string, negativePrompt: string): Promise<ImageOutputModel>;
}

export class GeminiImageAdapter implements ImageProviderAdapter {
  public providerName = 'Google Gemini Image API';

  public async generateImage(
    input: ImageInputModel,
    prompt: string,
    negativePrompt: string
  ): Promise<ImageOutputModel> {
    const startTime = Date.now();

    const response = await fetch('/api/image-ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input,
        prompt,
        negativePrompt,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Image generation request failed.';
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        // Fallback
      }
      throw new Error(`[${this.providerName}] ${errorMessage}`);
    }

    const data = await response.json();
    if (!data || !data.imageUrl) {
      throw new Error(`[${this.providerName}] Invalid response payload received.`);
    }

    const generationTimeMs = Date.now() - startTime;

    return {
      id: data.id || `img_${Date.now()}`,
      imageUrl: data.imageUrl,
      promptUsed: prompt,
      negativePrompt,
      dimensions: data.dimensions || this.getDimensionsForAspect(input.aspectRatio),
      imageSize: data.imageSize || Math.round((data.imageUrl.length * 3) / 4),
      generationTimeMs,
      provider: this.providerName,
      createdAt: new Date().toISOString(),
      style: input.style,
      aspectRatio: input.aspectRatio,
      platform: input.platform,
      imageType: input.imageType,
    };
  }

  private getDimensionsForAspect(aspectRatio: string): { width: number; height: number } {
    switch (aspectRatio) {
      case '16:9':
        return { width: 1200, height: 675 };
      case '9:16':
        return { width: 1080, height: 1920 };
      case '4:3':
        return { width: 1200, height: 900 };
      case '4:1':
        return { width: 1584, height: 396 };
      case '3:2':
        return { width: 1200, height: 800 };
      case '1:1':
      default:
        return { width: 1080, height: 1080 };
    }
  }
}

export class ImageProviderRegistry {
  private providers: Map<string, ImageProviderAdapter> = new Map();
  private primaryProviderKey = 'gemini';

  constructor() {
    this.register('gemini', new GeminiImageAdapter());
  }

  public register(key: string, adapter: ImageProviderAdapter): void {
    this.providers.set(key.toLowerCase(), adapter);
  }

  public getProvider(key?: string): ImageProviderAdapter {
    const targetKey = (key || this.primaryProviderKey).toLowerCase();
    const provider = this.providers.get(targetKey);
    if (!provider) {
      // Fallback to primary if requested key is unsupported
      return this.providers.get(this.primaryProviderKey)!;
    }
    return provider;
  }

  public getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const imageProviderRegistry = new ImageProviderRegistry();
