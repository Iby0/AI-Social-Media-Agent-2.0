import { ScheduleRule, ScheduleFrequency, TaskType } from '../../types/workflow';
import { logService } from '../../database/services/logService';

const SCHEDULER_STORAGE_KEY = 'ai_scheduler_rules_v1';

export class SchedulerService {
  public async getSchedules(): Promise<ScheduleRule[]> {
    try {
      const raw = localStorage.getItem(SCHEDULER_STORAGE_KEY);
      if (!raw) return this.getDefaultSchedules();
      return JSON.parse(raw);
    } catch {
      return this.getDefaultSchedules();
    }
  }

  public async saveSchedules(schedules: ScheduleRule[]): Promise<void> {
    try {
      localStorage.setItem(SCHEDULER_STORAGE_KEY, JSON.stringify(schedules));
    } catch (e) {
      console.warn('Failed to save schedule rules:', e);
    }
  }

  public async createSchedule(
    title: string,
    frequency: ScheduleFrequency,
    taskType: TaskType,
    customDate?: string,
    customTime?: string,
    timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    targetPostId?: string
  ): Promise<ScheduleRule> {
    const nextRunAt = this.calculateNextRun(frequency, customDate, customTime, timezone);

    const newRule: ScheduleRule = {
      id: `sched_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      targetPostId,
      frequency,
      customDate,
      customTime,
      timezone,
      nextRunAt,
      isActive: true,
      taskType,
      createdAt: new Date().toISOString(),
    };

    const current = await this.getSchedules();
    const updated = [newRule, ...current];
    await this.saveSchedules(updated);
    await logService.log(`New Schedule Rule Created: "${title}" [${frequency}]`, 'system', 'success');

    return newRule;
  }

  public async toggleSchedule(scheduleId: string): Promise<boolean> {
    const current = await this.getSchedules();
    let newStatus = false;
    const updated = current.map((s) => {
      if (s.id === scheduleId) {
        newStatus = !s.isActive;
        return { ...s, isActive: newStatus };
      }
      return s;
    });
    await this.saveSchedules(updated);
    return newStatus;
  }

  public async deleteSchedule(scheduleId: string): Promise<void> {
    const current = await this.getSchedules();
    const updated = current.filter((s) => s.id !== scheduleId);
    await this.saveSchedules(updated);
  }

  public calculateNextRun(
    frequency: ScheduleFrequency,
    customDate?: string,
    customTime?: string,
    timezone?: string
  ): string {
    const now = new Date();

    if (frequency === 'Custom' && customDate) {
      const timePart = customTime || '09:00';
      const isoStr = `${customDate}T${timePart}:00`;
      const dateObj = new Date(isoStr);
      return isNaN(dateObj.getTime()) ? new Date(now.getTime() + 3600000).toISOString() : dateObj.toISOString();
    }

    const next = new Date(now);

    if (customTime) {
      const [hrs, mins] = customTime.split(':').map(Number);
      next.setHours(hrs || 9, mins || 0, 0, 0);
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
    } else {
      next.setHours(next.getHours() + 1, 0, 0, 0);
    }

    switch (frequency) {
      case 'Daily':
        break;
      case 'Weekly':
        if (next <= now) next.setDate(next.getDate() + 7);
        break;
      case 'Monthly':
        if (next <= now) next.setMonth(next.getMonth() + 1);
        break;
      case 'One Time':
      default:
        break;
    }

    return next.toISOString();
  }

  public async checkDueSchedules(): Promise<ScheduleRule[]> {
    const schedules = await this.getSchedules();
    const now = new Date().getTime();

    const due = schedules.filter((s) => s.isActive && new Date(s.nextRunAt).getTime() <= now);

    if (due.length > 0) {
      // Advance next run for recurring ones
      const updated = schedules.map((s) => {
        if (s.isActive && new Date(s.nextRunAt).getTime() <= now) {
          if (s.frequency === 'One Time') {
            return { ...s, isActive: false };
          }
          return {
            ...s,
            nextRunAt: this.calculateNextRun(s.frequency, s.customDate, s.customTime, s.timezone),
          };
        }
        return s;
      });
      await this.saveSchedules(updated);
    }

    return due;
  }

  private getDefaultSchedules(): ScheduleRule[] {
    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';

    return [
      {
        id: 'sched_default_1',
        title: 'Morning Social Media Post Broadcast',
        frequency: 'Daily',
        customTime: '09:00',
        timezone: tz,
        nextRunAt: new Date(now.getTime() + 7200000).toISOString(),
        isActive: true,
        taskType: 'Publish Preparation',
        createdAt: now.toISOString(),
      },
      {
        id: 'sched_default_2',
        title: 'Weekly System Health & Asset Cleanup',
        frequency: 'Weekly',
        customTime: '02:00',
        timezone: tz,
        nextRunAt: new Date(now.getTime() + 86400000 * 3).toISOString(),
        isActive: true,
        taskType: 'Cleanup',
        createdAt: now.toISOString(),
      },
      {
        id: 'sched_default_3',
        title: 'Monthly Analytics & Account Synchronization',
        frequency: 'Monthly',
        customTime: '12:00',
        timezone: tz,
        nextRunAt: new Date(now.getTime() + 86400000 * 15).toISOString(),
        isActive: true,
        taskType: 'Sync',
        createdAt: now.toISOString(),
      },
    ];
  }
}

export const schedulerService = new SchedulerService();
