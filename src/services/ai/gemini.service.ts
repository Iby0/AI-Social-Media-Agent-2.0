import { AIInputModel, AIOutputModel } from '../../types/ai';

export interface AIProviderAdapter {
  name: string;
  generate(input: AIInputModel, prompt: string): Promise<AIOutputModel>;
}

export class GeminiProviderAdapter implements AIProviderAdapter {
  public name = 'Google Gemini API (Server-Side Proxy)';

  public async generate(input: AIInputModel, prompt: string): Promise<AIOutputModel> {
    const response = await fetch('/api/ai/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        prompt,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: 'Network / HTTP Error' }));
      throw new Error(errData.error || `AI generation failed with status code ${response.status}`);
    }

    const json = await response.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'AI generation returned empty response.');
    }

    return json.data as AIOutputModel;
  }
}

export const geminiAdapter = new GeminiProviderAdapter();
