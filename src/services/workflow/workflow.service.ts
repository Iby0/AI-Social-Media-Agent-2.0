import { WorkflowState, WorkflowHistoryItem } from '../../types/workflow';
import { logService } from '../../database/services/logService';

const WORKFLOW_HISTORY_KEY = 'ai_workflow_history_v1';

// State transition graph validation matrix
const ALLOWED_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  Draft: ['AI Generated', 'Review', 'Archived', 'Failed'],
  'AI Generated': ['Review', 'Draft', 'Archived', 'Failed'],
  Review: ['Approved', 'Draft', 'Archived', 'Failed'],
  Approved: ['Ready', 'Scheduled', 'Queued', 'Review', 'Archived'],
  Ready: ['Scheduled', 'Queued', 'Publishing Ready', 'Archived'],
  Scheduled: ['Queued', 'Ready', 'Publishing Ready', 'Failed', 'Archived'],
  Queued: ['Publishing Ready', 'Failed', 'Scheduled', 'Archived'],
  'Publishing Ready': ['Published', 'Failed', 'Queued'],
  Published: ['Archived'],
  Failed: ['Draft', 'Queued', 'Ready', 'Archived'],
  Archived: ['Draft'],
};

export class WorkflowService {
  public isValidTransition(fromState: WorkflowState, toState: WorkflowState): boolean {
    const allowed = ALLOWED_TRANSITIONS[fromState] || [];
    return allowed.includes(toState);
  }

  public async transitionState(
    targetPostId: string,
    postTitle: string,
    currentState: WorkflowState,
    newState: WorkflowState,
    user: string = 'System Workflow Engine',
    notes?: string
  ): Promise<WorkflowHistoryItem> {
    if (!this.isValidTransition(currentState, newState)) {
      throw new Error(`Invalid workflow transition from "${currentState}" to "${newState}".`);
    }

    const historyItem: WorkflowHistoryItem = {
      id: `wf_hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      workflowId: `wf_${targetPostId}`,
      targetPostId,
      postTitle,
      oldState: currentState,
      newState,
      timestamp: new Date().toISOString(),
      user,
      notes,
    };

    await this.saveHistory(historyItem);
    await logService.log(
      `Workflow State Transition for "${postTitle}": [${currentState}] ➔ [${newState}]`,
      'system',
      'info'
    );

    return historyItem;
  }

  public async getHistory(): Promise<WorkflowHistoryItem[]> {
    try {
      const raw = localStorage.getItem(WORKFLOW_HISTORY_KEY);
      if (!raw) return [];
      const list: WorkflowHistoryItem[] = JSON.parse(raw);
      return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  }

  public async saveHistory(item: WorkflowHistoryItem): Promise<void> {
    try {
      const current = await this.getHistory();
      const updated = [item, ...current].slice(0, 100);
      localStorage.setItem(WORKFLOW_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save workflow history item:', e);
    }
  }

  public async clearHistory(): Promise<void> {
    localStorage.removeItem(WORKFLOW_HISTORY_KEY);
  }
}

export const workflowService = new WorkflowService();
