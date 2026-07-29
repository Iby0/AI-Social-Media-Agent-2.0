import { AIInputModel, AIOutputModel, AIRateLimitStatus, AIHistoryItem } from '../../types/ai';
import { geminiAdapter, AIProviderAdapter } from './gemini.service';
import { cacheService } from './cache.service';
import { promptService } from './prompt.service';
import { validationService } from './validation.service';
import { logService } from '../../database';

const HISTORY_STORAGE_KEY = 'ai_content_history_v1';
const DEFAULT_DAILY_LIMIT = 50;
const DEFAULT_MINUTE_LIMIT = 10;

export class AIService {
  private activeAdapter: AIProviderAdapter = geminiAdapter;
  private dailyRequests = 0;
  private minuteRequests = 0;
  private lastRequestTime = 0;
  private isCoolingDown = false;
  private cooldownUntil = 0;

  constructor() {
    this.loadRateLimitState();
  }

  private loadRateLimitState(): void {
    try {
      const todayKey = `ai_rate_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        this.dailyRequests = parseInt(saved, 10) || 0;
      } else {
        this.dailyRequests = 0;
      }
    } catch (e) {
      this.dailyRequests = 0;
    }
  }

  private incrementRateLimit(): void {
    this.dailyRequests++;
    this.minuteRequests++;
    this.lastRequestTime = Date.now();

    try {
      const todayKey = `ai_rate_${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, String(this.dailyRequests));
    } catch (e) {
      // ignore
    }

    // Reset minute counter after 60s
    setTimeout(() => {
      this.minuteRequests = Math.max(0, this.minuteRequests - 1);
    }, 60000);
  }

  public getRateLimitStatus(): AIRateLimitStatus {
    const now = Date.now();
    const isCooling = this.isCoolingDown && now < this.cooldownUntil;
    const cooldownSecs = isCooling ? Math.ceil((this.cooldownUntil - now) / 1000) : 0;

    return {
      dailyLimit: DEFAULT_DAILY_LIMIT,
      dailyUsed: this.dailyRequests,
      minuteLimit: DEFAULT_MINUTE_LIMIT,
      minuteUsed: this.minuteRequests,
      isCoolingDown: isCooling,
      cooldownSeconds: cooldownSecs,
      quotaWarning: this.dailyRequests >= DEFAULT_DAILY_LIMIT * 0.8,
    };
  }

  public setProviderAdapter(adapter: AIProviderAdapter): void {
    this.activeAdapter = adapter;
  }

  public async generateContent(input: AIInputModel, bypassCache = false): Promise<{ result: AIOutputModel; cached: boolean }> {
    // 1. Validate Input
    const val = validationService.validateInput(input);
    if (!val.isValid) {
      throw new Error(val.errors.join(' '));
    }

    // 2. Check Rate Limits
    const rateStatus = this.getRateLimitStatus();
    if (rateStatus.dailyUsed >= rateStatus.dailyLimit) {
      throw new Error('Daily AI generation quota limit reached. Please try again tomorrow.');
    }
    if (rateStatus.minuteUsed >= rateStatus.minuteLimit) {
      this.triggerCooldown(30);
      throw new Error('Minute request limit reached. Rate limit cooldown active for 30 seconds.');
    }
    if (rateStatus.isCoolingDown) {
      throw new Error(`AI System cooling down. Please wait ${rateStatus.cooldownSeconds}s.`);
    }

    // 3. Check Cache
    if (!bypassCache) {
      const cachedResult = cacheService.getCachedResult(input);
      if (cachedResult) {
        this.saveHistoryItem(input, cachedResult, true);
        return { result: cachedResult, cached: true };
      }
    }

    // 4. Construct Prompt
    const tpl = promptService.getTemplateForInput(input.feature, input.platform);
    const interpolatedPrompt = tpl
      ? promptService.interpolateTemplate(tpl.template, input)
      : promptService.buildSystemPrompt(input) + `\n\nInput Topic/Content: ${input.topic || input.existingContent}`;

    // 5. Execute API Call with Retry Logic
    let attempts = 0;
    const maxRetries = 3;
    let lastError: any = null;
    let output: AIOutputModel | null = null;

    while (attempts < maxRetries) {
      try {
        attempts++;
        output = await this.activeAdapter.generate(input, interpolatedPrompt);
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`AI Generation Attempt ${attempts} failed:`, err);
        // Exponential Backoff Delay
        if (attempts < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
      }
    }

    if (!output) {
      this.triggerCooldown(15);
      throw new Error(lastError?.message || 'Failed to generate AI content after retries.');
    }

    // Post-process Character Count & Reading Time
    output.characterCount = output.caption.length;
    output.estimatedReadingTime = validationService.calculateReadingTime(output.caption);

    // 6. Update Cache & Rate Limit
    cacheService.setCacheResult(input, output);
    this.incrementRateLimit();

    // 7. Save History Log
    this.saveHistoryItem(input, output, false);

    // 8. Log System Activity
    await logService.log(
      `AI Content Generated (${input.feature.toUpperCase()} - ${input.platform})`,
      'system',
      'success'
    );

    return { result: output, cached: false };
  }

  private triggerCooldown(seconds: number): void {
    this.isCoolingDown = true;
    this.cooldownUntil = Date.now() + seconds * 1000;
  }

  public saveHistoryItem(input: AIInputModel, output: AIOutputModel, cached = false): AIHistoryItem {
    const item: AIHistoryItem = {
      id: `ai_hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      feature: input.feature,
      platform: input.platform,
      language: input.language,
      input,
      output,
      timestamp: new Date().toISOString(),
      cached,
      provider: this.activeAdapter.name,
    };

    try {
      const history = this.getHistory();
      history.unshift(item);
      // Limit local history to 100 entries
      if (history.length > 100) history.pop();
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save AI history:', e);
    }

    return item;
  }

  public getHistory(): AIHistoryItem[] {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  public clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }

  public deleteHistoryItem(id: string): void {
    try {
      const history = this.getHistory().filter((h) => h.id !== id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }
}

export const aiService = new AIService();
