export type WorkflowState =
  | 'Draft'
  | 'AI Generated'
  | 'Review'
  | 'Approved'
  | 'Ready'
  | 'Scheduled'
  | 'Queued'
  | 'Publishing Ready'
  | 'Published'
  | 'Failed'
  | 'Archived';

export type TaskPriority = 'Critical' | 'High' | 'Normal' | 'Low';

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'retrying' | 'cancelled';

export type TaskType =
  | 'Generate Content'
  | 'Generate Image'
  | 'Save Draft'
  | 'Schedule Post'
  | 'Publish Preparation'
  | 'Health Check'
  | 'Cleanup'
  | 'Sync';

export interface WorkflowTask {
  id: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  scheduledAt?: string;
  executedAt?: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
  retryDelayMs: number;
  error?: string;
  targetPostId?: string;
  payload?: Record<string, any>;
  result?: Record<string, any>;
}

export type ScheduleFrequency = 'One Time' | 'Daily' | 'Weekly' | 'Monthly' | 'Custom';

export interface ScheduleRule {
  id: string;
  title: string;
  targetPostId?: string;
  frequency: ScheduleFrequency;
  customDate?: string;
  customTime?: string;
  timezone: string;
  nextRunAt: string;
  isActive: boolean;
  taskType: TaskType;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  triggerEvent:
    | 'ON_CONTENT_GENERATED'
    | 'ON_POST_APPROVED'
    | 'ON_TASK_FAILED'
    | 'ON_SCHEDULE_DUE'
    | 'ON_POST_DRAFT_CREATED';
  condition: string;
  action: string;
  enabled: boolean;
  executionCount: number;
  lastExecutedAt?: string;
}

export interface WorkflowHistoryItem {
  id: string;
  workflowId: string;
  targetPostId?: string;
  postTitle?: string;
  oldState: WorkflowState;
  newState: WorkflowState;
  timestamp: string;
  user: string;
  notes?: string;
}

export interface WorkflowMetrics {
  runningTasks: number;
  queuedTasks: number;
  failedTasks: number;
  completedTasks: number;
  upcomingSchedules: number;
}
