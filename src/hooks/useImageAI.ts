import { useState, useCallback } from 'react';
import { ImageInputModel, ImageOutputModel } from '../types/image-ai';
import { imageAIService } from '../services/image-ai/image.service';

export function useImageAI() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latestOutput, setLatestOutput] = useState<ImageOutputModel | null>(null);
  const [generationStep, setGenerationStep] = useState<string>('');

  const generateImage = useCallback(async (input: ImageInputModel, useCache: boolean = true) => {
    setIsGenerating(true);
    setError(null);
    setGenerationStep('Analyzing visual composition prompt...');

    try {
      setTimeout(() => setGenerationStep('Synthesizing high-res graphic canvas...'), 800);
      setTimeout(() => setGenerationStep('Applying brand palette & style filters...'), 1800);

      const result = await imageAIService.generateImage(input, useCache);
      setLatestOutput(result);
      setGenerationStep('Image generation complete!');
      return result;
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred during image generation.';
      setError(msg);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateImage,
    isGenerating,
    generationStep,
    error,
    latestOutput,
    setLatestOutput,
    clearError,
  };
}
