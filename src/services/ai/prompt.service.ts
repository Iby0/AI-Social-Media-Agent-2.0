import { AIInputModel, AIFeatureType, PromptTemplateModel, ValidationResult } from '../../types/ai';
import { SocialPlatform } from '../../database/types';

export const DEFAULT_PROMPT_TEMPLATES: PromptTemplateModel[] = [
  {
    id: 'tpl_facebook_caption',
    name: 'Facebook Storytelling & Engagement',
    description: 'Engaging, conversational narrative tailored for Facebook pages and groups.',
    feature: 'caption',
    platform: 'facebook',
    template: `Write an engaging Facebook post about "{{topic}}".
Tone: {{tone}}
Target Audience: {{targetAudience}}
Language: {{language}}
Keywords to include: {{keywords}}
Emoji Level: {{emojiLevel}}
Call to Action Required: {{ctaRequired}}
Custom Instructions: {{customInstructions}}

Guidelines for Facebook:
- Start with a compelling hook in the first 2 lines.
- Use conversational storytelling and paragraph breaks.
- Include a warm call-to-action encouraging comments and shares.
- Output {{hashtagCount}} relevant hashtags at the end.`,
    placeholders: ['topic', 'tone', 'targetAudience', 'language', 'keywords', 'emojiLevel', 'ctaRequired', 'customInstructions', 'hashtagCount'],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_instagram_caption',
    name: 'Instagram High-Engagement Visual Caption',
    description: 'Visual-first caption with line breaks, emojis, and high-converting hashtag stack.',
    feature: 'caption',
    platform: 'instagram',
    template: `Write an Instagram caption for "{{topic}}".
Tone: {{tone}}
Target Audience: {{targetAudience}}
Language: {{language}}
Keywords: {{keywords}}
Emoji Density: {{emojiLevel}}
Hashtag Count: {{hashtagCount}}
Custom Instructions: {{customInstructions}}

Guidelines for Instagram:
- First line must be a powerful scroll-stopping hook.
- Use dot spacing or line breaks for clean aesthetics.
- Include {{hashtagCount}} niche and trending hashtags separated at the bottom.
- Provide a clear comment-driven or save-driven Call To Action.`,
    placeholders: ['topic', 'tone', 'targetAudience', 'language', 'keywords', 'emojiLevel', 'hashtagCount', 'customInstructions'],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_linkedin_thought_leadership',
    name: 'LinkedIn Thought Leadership',
    description: 'Professional insight post with bullet points, value hooks, and career relevance.',
    feature: 'caption',
    platform: 'linkedin',
    template: `Draft a high-impact LinkedIn post about "{{topic}}".
Tone: {{tone}}
Target Audience: {{targetAudience}}
Language: {{language}}
Key takeaways: {{keywords}}
Custom Instructions: {{customInstructions}}

Guidelines for LinkedIn:
- Strong opening hook without clickbait.
- Share professional insights or lessons learned using clean bullet points.
- Maintain professional authority while remaining approachable.
- End with a professional question to drive meaningful discussion in comments.
- Include 3-5 high-relevance professional hashtags.`,
    placeholders: ['topic', 'tone', 'targetAudience', 'language', 'keywords', 'customInstructions'],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_github_announcement',
    name: 'GitHub Technical Release & Announcement',
    description: 'Markdown-formatted technical post with code snippets, architecture highlights, and repo links.',
    feature: 'caption',
    platform: 'github',
    template: `Create a GitHub release/discussion announcement for "{{topic}}".
Tone: {{tone}}
Target Developers: {{targetAudience}}
Language: {{language}}
Key Tech Stack: {{keywords}}
Custom Instructions: {{customInstructions}}

Guidelines for GitHub:
- Write in clean Markdown format with headers, code blocks, and feature lists.
- Detail technical features, architecture, and installation commands.
- Include badges, issue links, or repository references if applicable.`,
    placeholders: ['topic', 'tone', 'targetAudience', 'language', 'keywords', 'customInstructions'],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_hashtag_generator',
    name: 'Platform Hashtag Stack Generator',
    description: 'Generate high-reach, low-competition, and niche hashtags for target platform.',
    feature: 'hashtag',
    platform: 'all',
    template: `Generate {{hashtagCount}} high-converting social media hashtags for topic "{{topic}}" on {{platform}}.
Target Language: {{language}}
Keywords: {{keywords}}
Category: {{contentType}}`,
    placeholders: ['hashtagCount', 'topic', 'platform', 'language', 'keywords', 'contentType'],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_image_prompt',
    name: 'Midjourney / Imagen Prompt Builder',
    description: 'High-detail visual prompt builder for social media visual assets.',
    feature: 'image_prompt',
    platform: 'all',
    template: `Create a detailed AI image generation prompt for topic "{{topic}}".
Brand Tone: {{tone}}
Target Visual Style: Modern, 4K, Vibrant High-Resolution Banner for {{platform}}.
Details: {{customInstructions}}`,
    placeholders: ['topic', 'tone', 'platform', 'customInstructions'],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class PromptService {
  private templates: PromptTemplateModel[] = [...DEFAULT_PROMPT_TEMPLATES];

  public getTemplates(): PromptTemplateModel[] {
    return this.templates;
  }

  public getTemplateForInput(feature: AIFeatureType, platform: SocialPlatform): PromptTemplateModel | null {
    const match = this.templates.find(
      (t) => t.feature === feature && (t.platform === platform || t.platform === 'all')
    );
    return match || this.templates.find((t) => t.feature === feature) || null;
  }

  public interpolateTemplate(templateStr: string, input: AIInputModel): string {
    const values: Record<string, string> = {
      topic: input.topic || 'General Topic',
      existingContent: input.existingContent || '',
      tone: input.tone || 'Professional',
      targetAudience: input.targetAudience || 'General Audience',
      language: input.language || 'English',
      keywords: (input.keywords || []).join(', ') || 'N/A',
      contentType: input.contentType || 'General',
      platform: input.platform,
      contentLength: input.contentLength || 'medium',
      ctaRequired: input.ctaRequired ? 'Yes' : 'No',
      hashtagCount: String(input.hashtagCount || 8),
      emojiLevel: input.emojiLevel || 'medium',
      customInstructions: input.customInstructions || 'None',
    };

    let result = templateStr;
    Object.keys(values).forEach((key) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, values[key]);
    });

    return result;
  }

  public buildSystemPrompt(input: AIInputModel): string {
    const isBangla = input.language === 'Bangla';
    const isMixed = input.language === 'Mixed Bengali + English';

    let langInstruction = 'Write primarily in English.';
    if (isBangla) {
      langInstruction = 'Write entirely in natural, fluent Bengali (বাংলা) language using Unicode Bengali script.';
    } else if (isMixed) {
      langInstruction =
        'Write in conversational "Banglish" / Mixed Bengali and English (commonly used by modern South Asian tech professionals, e.g. "আজকের AI tools কিন্তু আপনার workflow একদম smooth করে দেবে!"). Use both English and Bengali scripts seamlessly.';
    }

    return `You are an elite AI Social Media Growth Strategist and Copywriter.
Target Platform: ${input.platform.toUpperCase()}
Feature Goal: ${input.feature.toUpperCase().replace('_', ' ')}
Language Requirement: ${langInstruction}
Brand Voice / Tone: ${input.tone || 'Professional'}
Target Audience: ${input.targetAudience || 'General'}
Content Length: ${input.contentLength || 'medium'}
Emoji Level: ${input.emojiLevel || 'medium'}
Hashtag Count requested: ${input.hashtagCount || 8}

Return clean, structured JSON output matching the required response schema. Ensure the response is well-formatted and directly ready for publishing.`;
  }

  public validateTemplate(templateStr: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!templateStr || templateStr.trim().length === 0) {
      errors.push('Template text cannot be empty.');
    }

    const placeholderMatches = templateStr.match(/\{\{([a-zA-Z0-9_]+)\}\}/g);
    if (!placeholderMatches || placeholderMatches.length === 0) {
      warnings.push('Template contains no placeholders (e.g. {{topic}}, {{tone}}).');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  public registerCustomTemplate(template: Omit<PromptTemplateModel, 'id' | 'createdAt' | 'updatedAt' | 'version'>): PromptTemplateModel {
    const newTpl: PromptTemplateModel = {
      ...template,
      id: `custom_tpl_${Date.now()}`,
      version: 1,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.templates.unshift(newTpl);
    return newTpl;
  }
}

export const promptService = new PromptService();
