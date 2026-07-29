import React from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { History, ArrowRight, User, Clock, FileText, Trash2 } from 'lucide-react';
import { workflowService } from '../../services/workflow/workflow.service';

export const ExecutionHistory: React.FC = () => {
  const { history, refreshAllData } = useWorkflow();

  const handleClearHistory = async () => {
    await workflowService.clearHistory();
    await refreshAllData();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Workflow Execution & Transition History
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable audit log of all post workflow state updates and automation events.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log
          </button>
        )}
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl space-y-2">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No Workflow State Transitions Logged Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Transitions performed on the Workflow Board or automatically via queue rules will appear here.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-white">{item.postTitle || item.workflowId}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({item.id})</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {item.oldState}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                  <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300">
                    {item.newState}
                  </span>
                </div>

                {item.notes && <p className="text-[11px] text-slate-400 italic">{item.notes}</p>}
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 self-end md:self-center">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" />
                  {item.user}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
