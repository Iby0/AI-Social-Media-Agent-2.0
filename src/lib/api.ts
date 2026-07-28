import { AIGenerateRequest, AIGenerateResponse } from '../types';

export async function generateAIPost(params: AIGenerateRequest): Promise<AIGenerateResponse> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error || 'Failed to communicate with AI social generator endpoint.');
  }

  return body.data as AIGenerateResponse;
}

export async function generateAIImagePrompt(postContent: string, style?: string): Promise<{ imagePrompt: string; colorPalette: string[]; conceptDescription: string }> {
  const res = await fetch('/api/ai/image-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postContent, style }),
  });

  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error || 'Failed to generate AI image prompt.');
  }

  return body.data;
}
