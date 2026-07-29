import React from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import {
  Zap,
  Power,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Layers,
  Repeat,
  ShieldAlert,
} from 'lucide-react';

export const AutomationRuleCard: React.FC = () => {
  const { automationRules, toggleAutomationRule } = useWorkflow();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Event-Driven Automation Rule Engine
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Self-executing triggers controlling state progression, image synthesis, retries, and duplicate prevention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automationRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 rounded-xl border space-y-3 transition-all ${
              rule.enabled
                ? 'bg-slate-950 border-slate-800 hover:border-amber-500/60'
                : 'bg-slate-950/40 border-slate-800/60 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  {rule.name}
                </h4>
                <span className="text-[10px] text-amber-300/80 font-mono font-semibold">
                  Event: {rule.triggerEvent}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleAutomationRule(rule.id)}
                className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-[11px] font-bold ${
                  rule.enabled
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={rule.enabled ? 'Enabled - Click to Disable' : 'Disabled - Click to Enable'}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{rule.enabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{rule.description}</p>

            <div className="space-y-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
              <div>
                <strong className="text-slate-400">Condition:</strong> {rule.condition}
              </div>
              <div>
                <strong className="text-amber-400">Action:</strong> {rule.action}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              <span>Executions: <strong className="text-slate-200">{rule.executionCount || 0} times</strong></span>
              <span>
                Last Executed:{' '}
                {rule.lastExecutedAt ? new Date(rule.lastExecutedAt).toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
