import React, { useState } from 'react';
import { AgentProvider } from '../../context/AgentContext';
import { AgentStatus } from './AgentStatus';
import { QuickControls } from './QuickControls';
import { TaskTimeline } from './TaskTimeline';
import { AutomationSettings } from './AutomationSettings';
import { HealthPanel } from './HealthPanel';
import { ExecutionLog } from './ExecutionLog';
import { Bot, Sliders, Terminal, Activity, Zap, ShieldCheck } from 'lucide-react';

const InnerAgentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'logs'>('overview');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Bot className="w-3 h-3" /> Autonomous AI Agent
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> Zero Server Overhead
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Autonomous AI Social Agent & Automation Engine</h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Coordinating content generation, image prompt synthesis, draft creation, workflow transitions, and publisher dispatches automatically.
          </p>
        </div>

        <div className="shrink-0 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-emerald-400 border border-slate-700">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Module 20 Active
          </span>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Agent Command & Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Automation Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Terminal Logs</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AgentStatus />
              <TaskTimeline />
            </div>
            <div className="space-y-6">
              <QuickControls />
              <HealthPanel />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && <AutomationSettings />}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          <ExecutionLog />
        </div>
      )}
    </div>
  );
};

export const AgentDashboard: React.FC = () => {
  return (
    <AgentProvider>
      <InnerAgentDashboard />
    </AgentProvider>
  );
};
