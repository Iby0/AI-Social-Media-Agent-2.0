import { AutomationRule } from '../../types/workflow';
import { logService } from '../../database/services/logService';

const AUTOMATION_RULES_STORAGE_KEY = 'ai_automation_rules_v1';

export class AutomationService {
  public async getRules(): Promise<AutomationRule[]> {
    try {
      const raw = localStorage.getItem(AUTOMATION_RULES_STORAGE_KEY);
      if (!raw) return this.getDefaultRules();
      return JSON.parse(raw);
    } catch {
      return this.getDefaultRules();
    }
  }

  public async saveRules(rules: AutomationRule[]): Promise<void> {
    try {
      localStorage.setItem(AUTOMATION_RULES_STORAGE_KEY, JSON.stringify(rules));
    } catch (e) {
      console.warn('Failed to save automation rules:', e);
    }
  }

  public async toggleRule(ruleId: string): Promise<boolean> {
    const rules = await this.getRules();
    let newStatus = false;
    const updated = rules.map((r) => {
      if (r.id === ruleId) {
        newStatus = !r.enabled;
        return { ...r, enabled: newStatus };
      }
      return r;
    });
    await this.saveRules(updated);
    await logService.log(`Automation Rule (${ruleId}) set to ${newStatus ? 'ENABLED' : 'DISABLED'}`, 'system', 'info');
    return newStatus;
  }

  public async evaluateEvent(
    eventType: AutomationRule['triggerEvent'],
    eventContext?: Record<string, any>
  ): Promise<string[]> {
    const rules = await this.getRules();
    const matching = rules.filter((r) => r.enabled && r.triggerEvent === eventType);

    const triggeredActions: string[] = [];

    for (const rule of matching) {
      // Execute rule action
      triggeredActions.push(rule.action);

      // Increment execution counter
      rule.executionCount = (rule.executionCount || 0) + 1;
      rule.lastExecutedAt = new Date().toISOString();

      await logService.log(
        `Automation Rule Triggered: "${rule.name}" -> Executing action: ${rule.action}`,
        'system',
        'success'
      );
    }

    if (matching.length > 0) {
      await this.saveRules(rules);
    }

    return triggeredActions;
  }

  private getDefaultRules(): AutomationRule[] {
    return [
      {
        id: 'auto_rule_1',
        name: 'Auto-Generate Image After Content Creation',
        description: 'When new post content is AI generated, automatically enqueue a task to generate social post graphic image.',
        triggerEvent: 'ON_CONTENT_GENERATED',
        condition: 'Post has text content AND has no visual image attached',
        action: 'ENQUEUE_GENERATE_IMAGE_TASK',
        enabled: true,
        executionCount: 14,
        lastExecutedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'auto_rule_2',
        name: 'Auto-Queue Approved Content For Publishing',
        description: 'When post workflow state changes to "Approved", automatically enqueue "Publish Preparation" task.',
        triggerEvent: 'ON_POST_APPROVED',
        condition: 'State == Approved AND Scheduled Time is defined',
        action: 'ENQUEUE_PUBLISH_PREP_TASK',
        enabled: true,
        executionCount: 28,
        lastExecutedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'auto_rule_3',
        name: 'Exponential Backoff Retry on Task Failure',
        description: 'Automatically retry failed tasks up to 3 times using exponential backoff before marking as permanently failed.',
        triggerEvent: 'ON_TASK_FAILED',
        condition: 'Retry Count < Max Retries',
        action: 'RETRY_FAILED_TASK_WITH_BACKOFF',
        enabled: true,
        executionCount: 5,
        lastExecutedAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'auto_rule_4',
        name: 'Skip Expired Schedule Execution',
        description: 'If a schedule time passed while the application was offline, skip past duplicates and reset next run.',
        triggerEvent: 'ON_SCHEDULE_DUE',
        condition: 'Scheduled Time < Current Time - 1 Hour',
        action: 'SKIP_EXPIRED_SCHEDULE',
        enabled: true,
        executionCount: 2,
        lastExecutedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'auto_rule_5',
        name: 'Prevent Duplicate Queue Submissions',
        description: 'Check active task queue and reject new enqueues if an identical task is already pending or running.',
        triggerEvent: 'ON_POST_DRAFT_CREATED',
        condition: 'Identical task exists in queue with status pending/running',
        action: 'SUPPRESS_DUPLICATE_TASK',
        enabled: true,
        executionCount: 19,
        lastExecutedAt: new Date(Date.now() - 900000).toISOString(),
      },
    ];
  }
}

export const automationService = new AutomationService();
