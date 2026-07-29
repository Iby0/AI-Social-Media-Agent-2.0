import React from 'react';
import { WorkflowState } from '../../types/workflow';
import { useWorkflow } from '../../hooks/useWorkflow';
import {
  FileText,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Send,
  Archive,
  RotateCcw,
} from 'lucide-react';

interface WorkflowCardProps {
  id: string;
  title: string;
  topic?: string;
  currentState: WorkflowState;
  updatedAt?: string;
}

const STATE_COLORS: Record<WorkflowState, { bg: string; text: string; border: string }> = {
  Draft: { bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-700' },
  'AI Generated': { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-800' },
  Review: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-800' },
  Approved: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-800' },
  Ready: { bg: 'bg-cyan-950/80', text: 'text-cyan-300', border: 'border-cyan-800' },
  Scheduled: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-800' },
  Queued: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-800' },
  'Publishing Ready': { bg: 'bg-teal-950/80', text: 'text-teal-300', border: 'border-teal-800' },
  Published: { bg: 'bg-green-950/80', text: 'text-green-300', border: 'border-green-800' },
  Failed: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-800' },
  Archived: { bg: 'bg-slate-900', text: 'text-slate-500', border: 'border-slate-800' },
};

const NEXT_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  Draft: ['AI Generated', 'Review'],
  'AI Generated': ['Review', 'Draft'],
  Review: ['Approved', 'Draft', 'Failed'],
  Approved: ['Ready', 'Scheduled', 'Queued'],
  Ready: ['Scheduled', 'Queued', 'Publishing Ready'],
  Scheduled: ['Queued', 'Publishing Ready'],
  Queued: ['Publishing Ready', 'Failed'],
  'Publishing Ready': ['Published', 'Failed'],
  Published: ['Archived'],
  Failed: ['Draft', 'Queued'],
  Archived: ['Draft'],
};

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  id,
  title,
  topic,
  currentState,
  updatedAt,
}) => {
  const { transitionPostState } = useWorkflow();
  const stateStyle = STATE_COLORS[currentState] || STATE_COLORS.Draft;
  const availableTransitions = NEXT_TRANSITIONS[currentState] || [];

  const handleStateChange = async (newState: WorkflowState) => {
    try {
      await transitionPostState(id, title, currentState, newState, `Manual transition via Board UI`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div
      className={`p-3.5 rounded-xl border ${stateStyle.border} ${stateStyle.bg} space-y-3 shadow-md hover:shadow-lg transition-all`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold text-white line-clamp-2">{title}</span>
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${stateStyle.border} ${stateStyle.text}`}
        >
          {currentState}
        </span>
      </div>

      {topic && <p className="text-[11px] text-slate-400 line-clamp-1">Topic: {topic}</p>}

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {updatedAt ? new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
        </span>

        {/* Transition Quick Buttons */}
        {availableTransitions.length > 0 && (
          <div className="flex items-center gap-1">
            {availableTransitions.map((next) => (
              <button
                key={next}
                type="button"
                onClick={() => handleStateChange(next)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-semibold text-blue-300 flex items-center gap-0.5 transition-colors"
                title={`Advance to ${next}`}
              >
                <span>{next}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
