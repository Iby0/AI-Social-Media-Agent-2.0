import { useContext } from 'react';
import { WorkflowContext } from '../context/WorkflowContext';

export const useScheduler = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useScheduler must be used within a WorkflowProvider');
  }

  return {
    schedules: context.schedules,
    addSchedule: context.addSchedule,
    toggleSchedule: context.toggleSchedule,
    deleteSchedule: context.deleteSchedule,
    upcomingSchedulesCount: context.metrics.upcomingSchedules,
  };
};
