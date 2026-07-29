import { WorkflowTask, TaskPriority, TaskType, TaskStatus } from '../../types/workflow';
import { retryService } from './retry.service';
import { logService } from '../../database/services/logService';

const QUEUE_STORAGE_KEY = 'ai_task_queue_v1';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Critical: 1,
  High: 2,
  Normal: 3,
  Low: 4,
};

export class QueueService {
  public async getQueue(): Promise<WorkflowTask[]> {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (!raw) return this.getDefaultTasks();
      const list: WorkflowTask[] = JSON.parse(raw);
      return this.sortTasks(list);
    } catch {
      return this.getDefaultTasks();
    }
  }

  public async saveQueue(tasks: WorkflowTask[]): Promise<void> {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to persist task queue:', e);
    }
  }

  public async enqueue(
    type: TaskType,
    priority: TaskPriority = 'Normal',
    payload?: Record<string, any>,
    targetPostId?: string,
    scheduledAt?: string,
    maxRetries: number = 3
  ): Promise<WorkflowTask> {
    const queue = await this.getQueue();

    // Prevent duplicate active tasks
    const existing = queue.find(
      (t) =>
        t.type === type &&
        t.targetPostId === targetPostId &&
        (t.status === 'pending' || t.status === 'running' || t.status === 'retrying')
    );

    if (existing) {
      logService.log(`Duplicate task prevented for ${type} (Target: ${targetPostId || 'Global'})`, 'system', 'info');
      return existing;
    }

    const newTask: WorkflowTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      scheduledAt: scheduledAt || new Date().toISOString(),
      retryCount: 0,
      maxRetries,
      retryDelayMs: 0,
      targetPostId,
      payload,
    };

    const updated = [...queue, newTask];
    await this.saveQueue(updated);
    await logService.log(`Task Enqueued: [${type}] Priority: ${priority}`, 'system', 'success');

    return newTask;
  }

  public async processNextTask(): Promise<WorkflowTask | null> {
    const queue = await this.getQueue();
    const now = new Date().getTime();

    // Find highest priority pending task whose scheduledAt <= now
    const eligibleTasks = queue.filter(
      (t) => (t.status === 'pending' || t.status === 'retrying') && new Date(t.scheduledAt || t.createdAt).getTime() <= now
    );

    if (eligibleTasks.length === 0) return null;

    const nextTask = eligibleTasks[0];

    // Mark as running
    const updatedQueue = queue.map((t) =>
      t.id === nextTask.id ? { ...t, status: 'running' as TaskStatus, executedAt: new Date().toISOString() } : t
    );
    await this.saveQueue(updatedQueue);

    // Simulate task execution
    try {
      const result = await this.executeTaskPayload(nextTask);

      // Mark completed
      const finalQueue = (await this.getQueue()).map((t) =>
        t.id === nextTask.id
          ? {
              ...t,
              status: 'completed' as TaskStatus,
              completedAt: new Date().toISOString(),
              result,
            }
          : t
      );
      await this.saveQueue(finalQueue);
      await logService.log(`Task Execution Completed: [${nextTask.type}] (${nextTask.id})`, 'system', 'success');
      return { ...nextTask, status: 'completed', result };
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown execution error';

      if (retryService.shouldRetry(nextTask)) {
        const retriedTask = retryService.prepareRetryTask(nextTask, errorMsg);
        const retryQueue = (await this.getQueue()).map((t) => (t.id === nextTask.id ? retriedTask : t));
        await this.saveQueue(retryQueue);
        return retriedTask;
      } else {
        retryService.logPermanentFailure(nextTask, errorMsg);
        const failedQueue = (await this.getQueue()).map((t) =>
          t.id === nextTask.id
            ? {
                ...t,
                status: 'failed' as TaskStatus,
                completedAt: new Date().toISOString(),
                error: errorMsg,
              }
            : t
        );
        await this.saveQueue(failedQueue);
        return { ...nextTask, status: 'failed', error: errorMsg };
      }
    }
  }

  public async cancelTask(taskId: string): Promise<void> {
    const queue = await this.getQueue();
    const updated = queue.map((t) => (t.id === taskId ? { ...t, status: 'cancelled' as TaskStatus } : t));
    await this.saveQueue(updated);
    await logService.log(`Task Cancelled: ${taskId}`, 'system', 'info');
  }

  public async retryTask(taskId: string): Promise<WorkflowTask | null> {
    const queue = await this.getQueue();
    const task = queue.find((t) => t.id === taskId);
    if (!task) return null;

    const resetTask: WorkflowTask = {
      ...task,
      status: 'pending',
      retryCount: 0,
      scheduledAt: new Date().toISOString(),
      error: undefined,
    };

    const updated = queue.map((t) => (t.id === taskId ? resetTask : t));
    await this.saveQueue(updated);
    await logService.log(`Manual Task Retry Initiated: ${taskId}`, 'system', 'info');
    return resetTask;
  }

  public async clearCompletedAndCancelled(): Promise<void> {
    const queue = await this.getQueue();
    const updated = queue.filter((t) => t.status !== 'completed' && t.status !== 'cancelled');
    await this.saveQueue(updated);
  }

  private async executeTaskPayload(task: WorkflowTask): Promise<Record<string, any>> {
    // Artificial execution delay for real-time visibility
    await new Promise((resolve) => setTimeout(resolve, 1200));

    switch (task.type) {
      case 'Generate Content':
        return { message: 'AI Content post body generated successfully', generatedLength: 420 };
      case 'Generate Image':
        return { message: 'AI Image visual banner synthesized', assetUrl: 'data:image/svg+xml...' };
      case 'Save Draft':
        return { message: 'Post draft state persisted to local storage' };
      case 'Schedule Post':
        return { message: 'Post scheduled on targeted queue timeline' };
      case 'Publish Preparation':
        return { message: 'Payload formatted for platform API integration readiness' };
      case 'Health Check':
        return { message: 'System healthy. IndexedDB and API server active', status: 'OK' };
      case 'Cleanup':
        return { message: 'Purged expired cache and temporary artifacts' };
      case 'Sync':
        return { message: 'Synchronized social account status' };
      default:
        return { message: 'Task processed successfully' };
    }
  }

  private sortTasks(tasks: WorkflowTask[]): WorkflowTask[] {
    return [...tasks].sort((a, b) => {
      // 1. Sort by Priority
      const pA = PRIORITY_ORDER[a.priority] || 3;
      const pB = PRIORITY_ORDER[b.priority] || 3;
      if (pA !== pB) return pA - pB;

      // 2. Sort by scheduled time
      return new Date(a.scheduledAt || a.createdAt).getTime() - new Date(b.scheduledAt || b.createdAt).getTime();
    });
  }

  private getDefaultTasks(): WorkflowTask[] {
    const now = new Date();
    return [
      {
        id: 'task_default_1',
        type: 'Publish Preparation',
        priority: 'High',
        status: 'pending',
        createdAt: new Date(now.getTime() - 600000).toISOString(),
        scheduledAt: new Date(now.getTime() + 300000).toISOString(),
        retryCount: 0,
        maxRetries: 3,
        retryDelayMs: 2000,
        payload: { postTitle: 'Scaling Microservices with AI Automation' },
      },
      {
        id: 'task_default_2',
        type: 'Generate Image',
        priority: 'Normal',
        status: 'completed',
        createdAt: new Date(now.getTime() - 1200000).toISOString(),
        completedAt: new Date(now.getTime() - 900000).toISOString(),
        retryCount: 0,
        maxRetries: 3,
        retryDelayMs: 2000,
        result: { assetUrl: 'data:image/svg+xml...' },
      },
      {
        id: 'task_default_3',
        type: 'Health Check',
        priority: 'Low',
        status: 'completed',
        createdAt: new Date(now.getTime() - 1800000).toISOString(),
        completedAt: new Date(now.getTime() - 1795000).toISOString(),
        retryCount: 0,
        maxRetries: 3,
        retryDelayMs: 1000,
        result: { status: 'OK' },
      },
    ];
  }
}

export const queueService = new QueueService();
