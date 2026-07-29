import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  WorkflowState,
  WorkflowTask,
  ScheduleRule,
  AutomationRule,
  WorkflowHistoryItem,
  WorkflowMetrics,
  TaskPriority,
  TaskType,
  ScheduleFrequency,
} from '../types/workflow';
import { workflowService } from '../services/workflow/workflow.service';
import { queueService } from '../services/workflow/queue.service';
import { schedulerService } from '../services/workflow/scheduler.service';
import { automationService } from '../services/workflow/automation.service';

interface WorkflowContextType {
  tasks: WorkflowTask[];
  schedules: ScheduleRule[];
  automationRules: AutomationRule[];
  history: WorkflowHistoryItem[];
  metrics: WorkflowMetrics;
  isProcessingQueue: boolean;

  // Actions
  enqueueTask: (
    type: TaskType,
    priority?: TaskPriority,
    payload?: Record<string, any>,
    targetPostId?: string,
    scheduledAt?: string,
    maxRetries?: number
  ) => Promise<WorkflowTask>;

  transitionPostState: (
    targetPostId: string,
    postTitle: string,
    currentState: WorkflowState,
    newState: WorkflowState,
    notes?: string
  ) => Promise<WorkflowHistoryItem>;

  addSchedule: (
    title: string,
    frequency: ScheduleFrequency,
    taskType: TaskType,
    customDate?: string,
    customTime?: string,
    timezone?: string,
    targetPostId?: string
  ) => Promise<ScheduleRule>;

  toggleSchedule: (scheduleId: string) => Promise<void>;
  deleteSchedule: (scheduleId: string) => Promise<void>;
  toggleAutomationRule: (ruleId: string) => Promise<void>;
  retryTask: (taskId: string) => Promise<void>;
  cancelTask: (taskId: string) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
  processQueueNow: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

export const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRule[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [history, setHistory] = useState<WorkflowHistoryItem[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<WorkflowMetrics>({
    runningTasks: 0,
    queuedTasks: 0,
    failedTasks: 0,
    completedTasks: 0,
    upcomingSchedules: 0,
  });

  const refreshAllData = useCallback(async () => {
    try {
      const loadedTasks = await queueService.getQueue();
      const loadedSchedules = await schedulerService.getSchedules();
      const loadedRules = await automationService.getRules();
      const loadedHistory = await workflowService.getHistory();

      setTasks(loadedTasks);
      setSchedules(loadedSchedules);
      setAutomationRules(loadedRules);
      setHistory(loadedHistory);

      setMetrics({
        runningTasks: loadedTasks.filter((t) => t.status === 'running').length,
        queuedTasks: loadedTasks.filter((t) => t.status === 'pending' || t.status === 'retrying').length,
        failedTasks: loadedTasks.filter((t) => t.status === 'failed').length,
        completedTasks: loadedTasks.filter((t) => t.status === 'completed').length,
        upcomingSchedules: loadedSchedules.filter((s) => s.isActive).length,
      });
    } catch (err) {
      console.error('Failed to load workflow state:', err);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Background Loop for Task Processing & Schedule Evaluation
  useEffect(() => {
    const interval = setInterval(async () => {
      // 1. Check due schedules
      const dueSchedules = await schedulerService.checkDueSchedules();
      for (const sched of dueSchedules) {
        await queueService.enqueue(sched.taskType, 'High', { scheduleId: sched.id, title: sched.title }, sched.targetPostId);
        await automationService.evaluateEvent('ON_SCHEDULE_DUE', { scheduleId: sched.id });
      }

      // 2. Process task queue
      const queue = await queueService.getQueue();
      const pendingCount = queue.filter(
        (t) => (t.status === 'pending' || t.status === 'retrying') && new Date(t.scheduledAt || t.createdAt).getTime() <= Date.now()
      ).length;

      if (pendingCount > 0 && !isProcessingQueue) {
        setIsProcessingQueue(true);
        await queueService.processNextTask();
        setIsProcessingQueue(false);
        await refreshAllData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isProcessingQueue, refreshAllData]);

  const enqueueTask = async (
    type: TaskType,
    priority: TaskPriority = 'Normal',
    payload?: Record<string, any>,
    targetPostId?: string,
    scheduledAt?: string,
    maxRetries: number = 3
  ): Promise<WorkflowTask> => {
    const task = await queueService.enqueue(type, priority, payload, targetPostId, scheduledAt, maxRetries);
    await refreshAllData();
    return task;
  };

  const transitionPostState = async (
    targetPostId: string,
    postTitle: string,
    currentState: WorkflowState,
    newState: WorkflowState,
    notes?: string
  ): Promise<WorkflowHistoryItem> => {
    const item = await workflowService.transitionState(targetPostId, postTitle, currentState, newState, 'Current User', notes);

    // Evaluate automation triggers
    if (newState === 'AI Generated') {
      await automationService.evaluateEvent('ON_CONTENT_GENERATED', { targetPostId, postTitle });
    } else if (newState === 'Approved') {
      await automationService.evaluateEvent('ON_POST_APPROVED', { targetPostId, postTitle });
      await queueService.enqueue('Publish Preparation', 'High', { postTitle }, targetPostId);
    }

    await refreshAllData();
    return item;
  };

  const addSchedule = async (
    title: string,
    frequency: ScheduleFrequency,
    taskType: TaskType,
    customDate?: string,
    customTime?: string,
    timezone?: string,
    targetPostId?: string
  ): Promise<ScheduleRule> => {
    const rule = await schedulerService.createSchedule(title, frequency, taskType, customDate, customTime, timezone, targetPostId);
    await refreshAllData();
    return rule;
  };

  const toggleSchedule = async (scheduleId: string) => {
    await schedulerService.toggleSchedule(scheduleId);
    await refreshAllData();
  };

  const deleteSchedule = async (scheduleId: string) => {
    await schedulerService.deleteSchedule(scheduleId);
    await refreshAllData();
  };

  const toggleAutomationRule = async (ruleId: string) => {
    await automationService.toggleRule(ruleId);
    await refreshAllData();
  };

  const retryTask = async (taskId: string) => {
    await queueService.retryTask(taskId);
    await refreshAllData();
  };

  const cancelTask = async (taskId: string) => {
    await queueService.cancelTask(taskId);
    await refreshAllData();
  };

  const clearCompletedTasks = async () => {
    await queueService.clearCompletedAndCancelled();
    await refreshAllData();
  };

  const processQueueNow = async () => {
    if (isProcessingQueue) return;
    setIsProcessingQueue(true);
    await queueService.processNextTask();
    setIsProcessingQueue(false);
    await refreshAllData();
  };

  return (
    <WorkflowContext.Provider
      value={{
        tasks,
        schedules,
        automationRules,
        history,
        metrics,
        isProcessingQueue,
        enqueueTask,
        transitionPostState,
        addSchedule,
        toggleSchedule,
        deleteSchedule,
        toggleAutomationRule,
        retryTask,
        cancelTask,
        clearCompletedTasks,
        processQueueNow,
        refreshAllData,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};
