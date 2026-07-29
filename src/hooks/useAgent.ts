import { useAgentContext } from '../context/AgentContext';

export function useAgent() {
  const context = useAgentContext();

  return {
    agentState: context.agentState,
    currentTask: context.currentTask,
    logs: context.logs,
    tasksHistory: context.tasksHistory,
    runAutonomousCycle: context.runAutonomousCycle,
    pauseAgent: context.pauseAgent,
    resumeAgent: context.resumeAgent,
    clearLogs: context.clearLogs,
    isProcessing: context.isProcessing,
  };
}
