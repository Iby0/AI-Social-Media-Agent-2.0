import { TriggerPayload, TriggerType } from '../../types/agent';

export class TriggerService {
  static createPayload(type: TriggerType, triggeredBy: string = 'user'): TriggerPayload {
    return {
      type,
      triggeredBy,
      timestamp: new Date().toISOString(),
      forceRun: type === 'manual',
    };
  }

  static getGitHubActionsWorkflowYaml(): string {
    return `name: Autonomous AI Agent Scheduled Trigger

on:
  schedule:
    # Run every day at 09:00 UTC
    - cron: '0 9 * * *'
  workflow_dispatch:

jobs:
  trigger-agent:
    runs-on: ubuntu-latest
    steps:
      - name: Dispatch Agent Webhook
        run: |
          curl -X POST "\${{ secrets.APP_BASE_URL }}/api/agent/trigger" \\
            -H "Content-Type: application/json" \\
            -H "Authorization: Bearer \${{ secrets.AGENT_CRON_SECRET }}" \\
            -d '{"type": "github_actions", "triggeredBy": "GitHub Workflow"}'
`;
  }
}
