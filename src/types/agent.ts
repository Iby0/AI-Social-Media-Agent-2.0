export type AgentState =
  | 'idle'
  | 'checking'
  | 'generating'
  | 'waiting'
  | 'queued'
  | 'publishing_ready'
  | 'completed'
  | 'failed'
  | 'paused';

export type AutomationFrequency = 'daily' | 'weekly' | 'monthly' | 'manual';
export type AutomationOutputAction = 'draft_only' | 'generate_and_queue';

export interface AutomationRules {
  enabled: boolean;
  frequency: AutomationFrequency;
  outputAction: AutomationOutputAction;
  maxDailyTasks: number;
  retryFailedTasks: boolean;
  cleanupAfterPublish: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string;   // HH:mm
  preferredPlatforms: ('facebook' | 'instagram' | 'linkedin' | 'github')[];
  topics: string[];
}

export interface AgentTask {
  id: string;
  title: string;
  topic: string;
  targetPlatform: 'facebook' | 'instagram' | 'linkedin' | 'github';
  state: AgentState;
  progressPercentage: number;
  generatedContent?: string;
  generatedImageUrl?: string;
  draftId?: string;
  publishRequestId?: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  retries: number;
}

export interface ExecutionLogItem {
  id: string;
  timestamp: string;
  taskId?: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  details?: Record<string, any>;
}

export interface HealthMetrics {
  aiAvailability: 'healthy' | 'degraded' | 'offline';
  storageUsagePercent: number;
  tokenStatus: 'valid' | 'expiring' | 'invalid';
  queueSize: number;
  workflowErrorsCount: number;
  lastCheckedAt: string;
}

export type TriggerType = 'manual' | 'browser_session' | 'github_actions' | 'external_cron';

export interface TriggerPayload {
  type: TriggerType;
  triggeredBy: string;
  timestamp: string;
  forceRun?: boolean;
}
