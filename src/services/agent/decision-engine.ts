import { AutomationRules, HealthMetrics } from '../../types/agent';

export interface DecisionResult {
  shouldRun: boolean;
  reason: string;
  nextTopic?: string;
  nextPlatform?: 'facebook' | 'instagram' | 'linkedin' | 'github';
}

export class DecisionEngine {
  static evaluate(
    rules: AutomationRules,
    health: HealthMetrics,
    executedTodayCount: number
  ): DecisionResult {
    // 1. Check if automation is enabled
    if (!rules.enabled) {
      return { shouldRun: false, reason: 'Automation is disabled in settings.' };
    }

    // 2. Check Quiet Hours
    if (rules.quietHoursEnabled) {
      const now = new Date();
      const currentHoursMin = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      if (
        currentHoursMin >= rules.quietHoursStart &&
        currentHoursMin <= rules.quietHoursEnd
      ) {
        return {
          shouldRun: false,
          reason: `Current time (${currentHoursMin}) is within Quiet Hours (${rules.quietHoursStart} - ${rules.quietHoursEnd}).`,
        };
      }
    }

    // 3. Check Daily Limit
    if (executedTodayCount >= rules.maxDailyTasks) {
      return {
        shouldRun: false,
        reason: `Maximum daily task limit (${rules.maxDailyTasks}) reached for today.`,
      };
    }

    // 4. Check Health Metrics
    if (health.aiAvailability === 'offline') {
      return {
        shouldRun: false,
        reason: 'AI Service is currently offline.',
      };
    }

    if (health.storageUsagePercent > 95) {
      return {
        shouldRun: false,
        reason: 'IndexedDB storage usage exceeds safe limit (95%).',
      };
    }

    // Select random topic & platform from configured list
    const topics = rules.topics && rules.topics.length > 0 ? rules.topics : ['AI & Technology Trends', 'Productivity Hacks', 'Social Media Strategy'];
    const platforms = rules.preferredPlatforms && rules.preferredPlatforms.length > 0 ? rules.preferredPlatforms : ['facebook', 'instagram', 'linkedin', 'github'];

    const nextTopic = topics[Math.floor(Math.random() * topics.length)];
    const nextPlatform = platforms[Math.floor(Math.random() * platforms.length)] as
      | 'facebook'
      | 'instagram'
      | 'linkedin'
      | 'github';

    return {
      shouldRun: true,
      reason: 'All automation criteria satisfied. Ready for task execution.',
      nextTopic,
      nextPlatform,
    };
  }
}
