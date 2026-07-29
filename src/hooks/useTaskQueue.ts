import { useContext } from 'react';
import { WorkflowContext } from '../context/WorkflowContext';

export const useTaskQueue = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useTaskQueue must be used within a WorkflowProvider');
  }

  return {
    tasks: context.tasks,
    enqueueTask: context.enqueueTask,
    cancelTask: context.cancelTask,
    retryTask: context.retryTask,
    clearCompletedTasks: context.clearCompletedTasks,
    processQueueNow: context.processQueueNow,
    metrics: context.metrics,
    isProcessing: context.isProcessingQueue,
  };
};
