import { useAgentContext } from '../context/AgentContext';

export function useAutomation() {
  const context = useAgentContext();

  return {
    rules: context.rules,
    health: context.health,
    updateRules: context.updateRules,
    refreshHealth: context.refreshHealth,
  };
}
