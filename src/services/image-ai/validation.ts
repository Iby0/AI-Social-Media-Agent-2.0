import { ImageInputModel, ImageOutputModel, ImageAIValidationResult } from '../../types/image-ai';

export const VALID_ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '4:1', '3:2'];
export const VALID_STYLES = [
  'Minimal',
  'Corporate',
  'Modern',
  'Technology',
  'Professional',
  'Creative',
  'Dark',
  'Light',
  'Gradient',
  'Flat Design',
];

export class ImageValidationService {
  public validateInput(input: ImageInputModel): ImageAIValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check empty topic or custom prompt
    const hasTopic = input.topic && input.topic.trim().length > 0;
    const hasPrompt = input.customPrompt && input.customPrompt.trim().length > 0;

    if (!hasTopic && !hasPrompt) {
      errors.push('Please provide a Topic or Custom Image Prompt.');
    } else if (hasTopic && input.topic.trim().length < 3) {
      errors.push('Topic description must be at least 3 characters long.');
    }

    // 2. Validate Style
    if (!VALID_STYLES.includes(input.style)) {
      warnings.push(`Style "${input.style}" is custom. Defaulting layout parameters.`);
    }

    // 3. Validate Aspect Ratio
    if (!VALID_ASPECT_RATIOS.includes(input.aspectRatio)) {
      errors.push(`Invalid aspect ratio "${input.aspectRatio}". Must be one of: ${VALID_ASPECT_RATIOS.join(', ')}`);
    }

    // 4. Input length limit check
    const combinedPrompt = (input.topic || '') + (input.customPrompt || '') + (input.caption || '');
    if (combinedPrompt.length > 5000) {
      errors.push('Image description exceeds maximum length of 5,000 characters.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  public validateOutput(output: ImageOutputModel): boolean {
    if (!output) return false;
    if (!output.imageUrl || (!output.imageUrl.startsWith('data:') && !output.imageUrl.startsWith('http'))) {
      return false;
    }
    return true;
  }
}

export const imageValidationService = new ImageValidationService();
