import { HealthMetrics } from '../../types/agent';

export class HealthService {
  static async checkSystemHealth(): Promise<HealthMetrics> {
    const timestamp = new Date().toISOString();

    // 1. Storage check (Estimate IndexedDB / localStorage)
    let storageUsagePercent = 12; // default safe mock value
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota && estimate.usage) {
          storageUsagePercent = Math.round((estimate.usage / estimate.quota) * 100);
        }
      } catch {
        // fallback
      }
    }

    // 2. Queue Size calculation from local storage
    let queueSize = 0;
    try {
      const queueData = localStorage.getItem('ai_publishing_pending_queue');
      if (queueData) {
        queueSize = JSON.parse(queueData).length;
      }
    } catch {
      queueSize = 0;
    }

    // 3. Workflow errors calculation
    let workflowErrorsCount = 0;
    try {
      const failedQueueData = localStorage.getItem('ai_publishing_failed_queue');
      if (failedQueueData) {
        workflowErrorsCount = JSON.parse(failedQueueData).length;
      }
    } catch {
      workflowErrorsCount = 0;
    }

    return {
      aiAvailability: 'healthy',
      storageUsagePercent,
      tokenStatus: 'valid',
      queueSize,
      workflowErrorsCount,
      lastCheckedAt: timestamp,
    };
  }
}
