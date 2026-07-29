import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AgentState,
  AgentTask,
  AutomationRules,
  ExecutionLogItem,
  HealthMetrics,
  TriggerType,
} from '../types/agent';
import { AgentService, DEFAULT_RULES } from '../services/agent/agent.service';
import { HealthService } from '../services/agent/health.service';
import { DecisionEngine } from '../services/agent/decision-engine';
import { Orchestrator } from '../services/agent/orchestrator';
import { TriggerService } from '../services/agent/trigger.service';

interface AgentContextType {
  agentState: AgentState;
  currentTask: AgentTask | null;
  rules: AutomationRules;
  health: HealthMetrics | null;
  logs: ExecutionLogItem[];
  tasksHistory: AgentTask[];
  updateRules: (newRules: Partial<AutomationRules>) => void;
  runAutonomousCycle: (triggerType?: TriggerType) => Promise<void>;
  pauseAgent: () => void;
  resumeAgent: () => void;
  clearLogs: () => void;
  refreshHealth: () => Promise<void>;
  isProcessing: boolean;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const SAMPLE_INITIAL_TASKS: AgentTask[] = [
  {
    id: 'task_sample_01',
    title: 'Autonomous Post: Enterprise Cloud Architectures',
    topic: 'Enterprise Cloud Architectures',
    targetPlatform: 'linkedin',
    state: 'completed',
    progressPercentage: 100,
    generatedContent: '🚀 Exploring high-concurrency cloud architecture patterns and zero-trust security frameworks. Enterprise scalability achieved via serverless execution!',
    publishRequestId: 'urn:li:share:987123',
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    retries: 0,
  },
  {
    id: 'task_sample_02',
    title: 'Autonomous Post: AI Social Media Workflows',
    topic: 'AI Social Media Workflows',
    targetPlatform: 'facebook',
    state: 'completed',
    progressPercentage: 100,
    generatedContent: 'Automate content scheduling, approval gates, and multi-channel posting using our official Graph API publisher engine.',
    publishRequestId: 'fb_page_871239123',
    completedAt: new Date(Date.now() - 43200000).toISOString(),
    retries: 0,
  },
];

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [currentTask, setCurrentTask] = useState<AgentTask | null>(null);
  const [rules, setRules] = useState<AutomationRules>(() => AgentService.getRules());
  const [health, setHealth] = useState<HealthMetrics | null>(null);
  const [logs, setLogs] = useState<ExecutionLogItem[]>(() => AgentService.getLogs());
  const [tasksHistory, setTasksHistory] = useState<AgentTask[]>(() => {
    const saved = AgentService.getTasks();
    return saved.length > 0 ? saved : SAMPLE_INITIAL_TASKS;
  });

  const refreshHealth = useCallback(async () => {
    const metrics = await HealthService.checkSystemHealth();
    setHealth(metrics);
  }, []);

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 30000); // refresh health every 30s
    return () => clearInterval(interval);
  }, [refreshHealth]);

  const updateRules = useCallback((newRules: Partial<AutomationRules>) => {
    setRules((prev) => {
      const updated = { ...prev, ...newRules };
      AgentService.saveRules(updated);
      return updated;
    });
    AgentService.addLog({
      level: 'info',
      message: 'Automation settings & execution rules updated.',
    });
    setLogs(AgentService.getLogs());
  }, []);

  const runAutonomousCycle = useCallback(
    async (triggerType: TriggerType = 'manual') => {
      if (agentState === 'paused') {
        AgentService.addLog({
          level: 'warn',
          message: 'Autonomous cycle trigger ignored because Agent is currently PAUSED.',
        });
        setLogs(AgentService.getLogs());
        return;
      }

      setAgentState('checking');
      const payload = TriggerService.createPayload(triggerType);

      AgentService.addLog({
        level: 'info',
        message: `Agent cycle triggered via [${triggerType.toUpperCase()}]. Evaluating decision engine rules...`,
        details: payload,
      });
      setLogs(AgentService.getLogs());

      // 1. Fetch fresh system health
      const currentHealth = await HealthService.checkSystemHealth();
      setHealth(currentHealth);

      // 2. Count today's executed tasks
      const todayStr = new Date().toISOString().split('T')[0];
      const todayCount = tasksHistory.filter(
        (t) => t.completedAt && t.completedAt.startsWith(todayStr)
      ).length;

      // 3. Evaluate Decision Engine
      const decision = DecisionEngine.evaluate(rules, currentHealth, todayCount);

      if (!decision.shouldRun && triggerType !== 'manual') {
        setAgentState('idle');
        AgentService.addLog({
          level: 'warn',
          message: `Decision Engine skipped run: ${decision.reason}`,
        });
        setLogs(AgentService.getLogs());
        return;
      }

      const topic = decision.nextTopic || rules.topics[0] || 'AI & Tech Trends';
      const platform = decision.nextPlatform || rules.preferredPlatforms[0] || 'facebook';

      // 4. Orchestrate Task
      const completedTask = await Orchestrator.executeTask(topic, platform, rules, {
        onStateChange: (updatedTask) => {
          setCurrentTask(updatedTask);
          setAgentState(updatedTask.state);
        },
        onLog: (logData) => {
          AgentService.addLog(logData);
          setLogs(AgentService.getLogs());
        },
      });

      // 5. Finalize history
      AgentService.saveTask(completedTask);
      setTasksHistory((prev) => [completedTask, ...prev.filter((t) => t.id !== completedTask.id)]);
      setCurrentTask(null);
      setAgentState(rules.enabled ? 'idle' : 'paused');
    },
    [agentState, rules, tasksHistory]
  );

  const pauseAgent = useCallback(() => {
    setAgentState('paused');
    updateRules({ enabled: false });
    AgentService.addLog({
      level: 'warn',
      message: 'Agent paused by user. Autonomous triggers suppressed.',
    });
    setLogs(AgentService.getLogs());
  }, [updateRules]);

  const resumeAgent = useCallback(() => {
    setAgentState('idle');
    updateRules({ enabled: true });
    AgentService.addLog({
      level: 'info',
      message: 'Agent resumed by user. Autonomous decision engine active.',
    });
    setLogs(AgentService.getLogs());
  }, [updateRules]);

  const handleClearLogs = useCallback(() => {
    AgentService.clearLogs();
    setLogs([]);
  }, []);

  return (
    <AgentContext.Provider
      value={{
        agentState,
        currentTask,
        rules,
        health,
        logs,
        tasksHistory,
        updateRules,
        runAutonomousCycle,
        pauseAgent,
        resumeAgent,
        clearLogs: handleClearLogs,
        refreshHealth,
        isProcessing: ['checking', 'generating', 'waiting', 'queued'].includes(agentState),
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  return context;
};
