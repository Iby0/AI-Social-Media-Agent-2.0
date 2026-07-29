import { WorkflowTask } from '../../types/workflow';
import { logService } from '../../database/services/logService';

export class RetryService {
  private defaultMaxRetries = 3;
  private baseDelayMs = 2000; // 2s base

  public calculateBackoffDelay(retryCount: number): number {
    // Exponential backoff: baseDelay * 2^retryCount + jitter
    const delay = this.baseDelayMs * Math.pow(2, retryCount);
    const jitter = Math.floor(Math.random() * 500);
    return delay + jitter;
  }

  public shouldRetry(task: WorkflowTask): boolean {
    return task.retryCount < (task.maxRetries || this.defaultMaxRetries);
  }

  public prepareRetryTask(task: WorkflowTask, errorMessage: string): WorkflowTask {
    const nextRetryCount = task.retryCount + 1;
    const delay = this.calculateBackoffDelay(nextRetryCount);
    const scheduledAt = new Date(Date.now() + delay).toISOString();

    logService.log(
      `Task "${task.type}" (${task.id}) failed. Scheduling retry #${nextRetryCount} in ${(delay / 1000).toFixed(1)}s. Error: ${errorMessage}`,
      'error',
      'warning'
    );

    return {
      ...task,
      status: 'retrying',
      retryCount: nextRetryCount,
      retryDelayMs: delay,
      scheduledAt,
      error: errorMessage,
    };
  }

  public logPermanentFailure(task: WorkflowTask, errorMessage: string): void {
    logService.log(
      `Task "${task.type}" (${task.id}) permanently failed after ${task.retryCount} retries. Final Error: ${errorMessage}`,
      'error',
      'error'
    );
  }
}

export const retryService = new RetryService();
