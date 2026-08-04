export interface EnvironmentConfig {
  isProduction: boolean;
  isDevelopment: boolean;
  appVersion: string;
  hasGeminiKey: boolean;
  hasCustomApiHost: boolean;
  missingKeys: string[];
  warnings: string[];
}

export class EnvironmentService {
  static validateEnvironment(): EnvironmentConfig {
    const missingKeys: string[] = [];
    const warnings: string[] = [];

    const isProduction = import.meta.env.PROD;
    const isDevelopment = import.meta.env.DEV;
    const appVersion = '1.0.0';

    // Gemini API Key check (handled server-side or via process.env/import.meta.env)
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
    const hasGeminiKey = Boolean(geminiKey && geminiKey.trim() !== '');

    if (!hasGeminiKey) {
      warnings.push('GEMINI_API_KEY is not configured. AI fallback mode will use local heuristic engines.');
    }

    return {
      isProduction,
      isDevelopment,
      appVersion,
      hasGeminiKey,
      hasCustomApiHost: false,
      missingKeys,
      warnings,
    };
  }

  static sanitizeInput(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}
