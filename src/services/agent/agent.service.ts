import { AutomationRules, AgentTask, ExecutionLogItem } from '../../types/agent';

const RULES_STORAGE_KEY = 'ai_agent_automation_rules';
const LOGS_STORAGE_KEY = 'ai_agent_execution_logs';
const TASKS_STORAGE_KEY = 'ai_agent_tasks_history';

export const DEFAULT_RULES: AutomationRules = {
  enabled: true,
  frequency: 'daily',
  outputAction: 'generate_and_queue',
  maxDailyTasks: 5,
  retryFailedTasks: true,
  cleanupAfterPublish: false,
  quietHoursEnabled: false,
  quietHoursStart: '23:00',
  quietHoursEnd: '06:00',
  preferredPlatforms: ['facebook', 'instagram', 'linkedin', 'github'],
  topics: ['AI & Enterprise Tech', 'Productivity Strategies', 'Digital Marketing Trends', 'Cloud Architecture'],
};

export class AgentService {
  static getRules(): AutomationRules {
    try {
      const data = localStorage.getItem(RULES_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_RULES;
    } catch {
      return DEFAULT_RULES;
    }
  }

  static saveRules(rules: AutomationRules): void {
    try {
      localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    } catch (e) {
      console.warn('Failed to save automation rules to localStorage', e);
    }
  }

  static getLogs(): ExecutionLogItem[] {
    try {
      const data = localStorage.getItem(LOGS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addLog(log: Omit<ExecutionLogItem, 'id' | 'timestamp'>): ExecutionLogItem {
    const logs = this.getLogs();
    const newLog: ExecutionLogItem = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save log', e);
    }
    return newLog;
  }

  static clearLogs(): void {
    localStorage.removeItem(LOGS_STORAGE_KEY);
  }

  static getTasks(): AgentTask[] {
    try {
      const data = localStorage.getItem(TASKS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveTask(task: AgentTask): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.unshift(task);
    }
    if (tasks.length > 50) tasks.pop();
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save task', e);
    }
  }
}
