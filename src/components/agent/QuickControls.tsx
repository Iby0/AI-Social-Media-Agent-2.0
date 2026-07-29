import React, { useState } from 'react';
import { useAgent } from '../../hooks/useAgent';
import { Play, Pause, RefreshCw, Trash2, Code, Copy, Check, Sparkles } from 'lucide-react';
import { TriggerService } from '../../services/agent/trigger.service';

export const QuickControls: React.FC = () => {
  const { agentState, runAutonomousCycle, pauseAgent, resumeAgent, clearLogs, isProcessing } = useAgent();
  const [showYamlModal, setShowYamlModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPaused = agentState === 'paused';

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(TriggerService.getGitHubActionsWorkflowYaml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-bold text-slate-900">Agent Command Center</h3>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isProcessing || isPaused}
          onClick={() => runAutonomousCycle('manual')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50 transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Execute Autonomous Cycle</span>
        </button>

        {isPaused ? (
          <button
            type="button"
            onClick={resumeAgent}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Resume Agent</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={pauseAgent}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause Agent</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowYamlModal(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
        >
          <Code className="w-3.5 h-3.5" />
          <span>GitHub Actions Cron Spec</span>
        </button>

        <button
          type="button"
          onClick={clearLogs}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Logs</span>
        </button>
      </div>

      {/* GitHub Actions YAML Export Modal */}
      {showYamlModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                GitHub Actions Zero-Cost Cron Trigger
              </h3>
              <button
                type="button"
                onClick={() => setShowYamlModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Place this workflow YAML inside <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">.github/workflows/agent-trigger.yml</code> to run daily cron jobs for free without paid cloud servers.
            </p>

            <div className="relative bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-60 border border-slate-800">
              <button
                type="button"
                onClick={handleCopyYaml}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-[10px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Spec'}</span>
              </button>
              <pre>{TriggerService.getGitHubActionsWorkflowYaml()}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowYamlModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
