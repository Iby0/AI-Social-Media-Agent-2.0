import { ImageInputModel, ImageStyle, ImageType, ImagePromptTemplate } from '../../types/image-ai';

export const IMAGE_PROMPT_TEMPLATES: ImagePromptTemplate[] = [
  {
    id: 'tpl_tech_minimal',
    name: 'Minimal Tech Banner',
    description: 'Clean vector illustration for software release or tech insight',
    style: 'Technology',
    imageType: 'LinkedIn Banner',
    promptTemplate: 'Minimalist high-tech banner illustration representing {{topic}}. Modern vector graphics with dark navy background, subtle glowing accents, clean geometric nodes, professional software engineering concept. High resolution 4k, clean vector art.',
    negativePromptTemplate: 'photorealistic human faces, messy text, grainy noise, low quality, dark clutter, blurred edges, distorted layout',
  },
  {
    id: 'tpl_corporate_announcement',
    name: 'Corporate Announcement',
    description: 'Sleek executive banner for business news and milestones',
    style: 'Corporate',
    imageType: 'Announcement',
    promptTemplate: 'Executive corporate announcement banner about {{topic}}. Modern office aesthetic, sleek glassmorphism panels, polished silver and deep indigo palette, clean typography placeholder, professional business branding concept.',
    negativePromptTemplate: 'cartoonish figures, low contrast, oversaturated rainbow colors, cluttered background, distorted shapes',
  },
  {
    id: 'tpl_creative_quote',
    name: 'Creative Quote Card',
    description: 'Vibrant quote graphic layout with abstract backdrop',
    style: 'Creative',
    imageType: 'Quote Card',
    promptTemplate: 'Vibrant artistic backdrop for quote graphic regarding {{topic}}. Soft gradient mesh, fluid dynamic shapes, elegant typography aesthetic, modern Instagram square card composition.',
    negativePromptTemplate: 'heavy busy patterns, unreadable clutter, low resolution, pixelated edges',
  },
];

export class PromptBuilderService {
  public buildPrompt(input: ImageInputModel): { prompt: string; negativePrompt: string } {
    const styleDescription = this.getStyleDescription(input.style);
    const aspectDetails = this.getAspectDetails(input.aspectRatio, input.imageType);

    const brandColorsText = input.brandColors && input.brandColors.length > 0
      ? `Brand Color Palette: ${input.brandColors.join(', ')}.`
      : '';

    const backgroundText = input.backgroundPreference
      ? `Background preference: ${input.backgroundPreference}.`
      : '';

    const keywordsText = input.keywords && input.keywords.length > 0
      ? `Key visual motifs: ${input.keywords.join(', ')}.`
      : '';

    const logoText = input.logoPosition && input.logoPosition !== 'none'
      ? `Include subtle clean brand badge placeholder framing at ${input.logoPosition}.`
      : '';

    const customText = input.customPrompt ? input.customPrompt : '';

    const baseTopic = input.topic || 'Modern technology innovation and digital workflow';

    const prompt = `A professional ${input.imageType} graphic asset for ${input.platform.toUpperCase()}.
Subject Concept: ${baseTopic}.
${input.caption ? `Context summary: ${input.caption.slice(0, 150)}.` : ''}
Visual Style: ${styleDescription}.
Composition Layout: ${aspectDetails}.
${keywordsText}
${brandColorsText}
${backgroundText}
${logoText}
${customText}
Render quality: High-resolution 4k, crisp typography alignment, studio lighting, vector precision, clean digital art.`.trim();

    const negativePrompt = input.negativePrompt ||
      'blurry, low resolution, distorted faces, watermark, ugly text overlap, extra limbs, artifacts, noisy compression, pixelated graphics, unintended clutter';

    return { prompt, negativePrompt };
  }

  public optimizePrompt(rawPrompt: string): string {
    return rawPrompt
      .replace(/\s+/g, ' ')
      .replace(/,,+/g, ',')
      .trim();
  }

  private getStyleDescription(style: ImageStyle): string {
    switch (style) {
      case 'Minimal':
        return 'Minimalist clean vector, generous negative space, subtle line art, elegant simplicity';
      case 'Corporate':
        return 'Polished corporate aesthetic, deep indigo and slate blue tones, glassmorphism UI elements, professional B2B design';
      case 'Technology':
        return 'Cybernetic glowing circuit nodes, isometric 3D developer tech stack, neon cyan and indigo accents';
      case 'Creative':
        return 'Dynamic fluid gradient waves, vibrant colors, expressive artistic composition';
      case 'Dark':
        return 'Luxury dark mode canvas, obsidian black, metallic silver edge highlights, deep contrast';
      case 'Light':
        return 'Crisp off-white canvas, soft pastel shadows, high-contrast typography, clean light design';
      case 'Gradient':
        return 'Smooth multi-color mesh gradient backdrop, modern vibrant aesthetics';
      case 'Flat Design':
        return '2D flat vector graphic style, solid color blocks, bold iconography';
      case 'Modern':
      case 'Professional':
      default:
        return 'Contemporary digital design, balanced typography layout, crisp vector graphics';
    }
  }

  private getAspectDetails(ratio: string, imageType: ImageType): string {
    return `Framed specifically for ${imageType} with aspect ratio ${ratio}. Centered hero visual focal point with clean margins.`;
  }
}

export const promptBuilderService = new PromptBuilderService();
