import React, { useState } from 'react';
import { WorkflowProvider } from '../../context/WorkflowContext';
import { useWorkflow } from '../../hooks/useWorkflow';
import { TaskQueue } from './TaskQueue';
import { WorkflowBoard } from './WorkflowBoard';
import { SchedulerCalendar } from './SchedulerCalendar';
import { AutomationRuleCard } from './AutomationRuleCard';
import { ExecutionHistory } from './ExecutionHistory';
import {
  Workflow as WorkflowIcon,
  Zap,
  ListTodo,
  Layers,
  Calendar,
  History,
  Play,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

const InnerWorkflowDashboard: React.FC = () => {
  const { metrics, isProcessingQueue, processQueueNow } = useWorkflow();
  const [activeTab, setActiveTab] = useState<'queue' | 'board' | 'scheduler' | 'rules' | 'history'>('board');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Module 18 &bull; AI Workflow & Scheduler Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <WorkflowIcon className="w-7 h-7 text-indigo-400" />
            AI Scheduler & Workflow Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
            Control content progression across 11 lifecycle states from Draft to Publishing Preparation with priority task queue workers, timezone-aware schedules, and event automation rules.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="relative z-10 flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'board'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Workflow Board
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'queue'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            Task Queue
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scheduler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'scheduler'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Scheduler
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'rules'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Automation Rules
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
        </div>
      </div>

      {/* Monitoring Widgets Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Widget 1: Running Tasks */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Running Tasks</span>
            <Play className={`w-4 h-4 ${metrics.runningTasks > 0 ? 'text-amber-400 animate-spin' : 'text-slate-600'}`} />
          </div>
          <div className="text-2xl font-black text-white">{metrics.runningTasks}</div>
          <p className="text-[10px] text-slate-500">Worker active thread</p>
        </div>

        {/* Widget 2: Queued Tasks */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Queued Tasks</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-300">{metrics.queuedTasks}</div>
          <p className="text-[10px] text-slate-500">Awaiting execution</p>
        </div>

        {/* Widget 3: Failed Tasks */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Failed Tasks</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">{metrics.failedTasks}</div>
          <p className="text-[10px] text-slate-500">Backoff retry pending</p>
        </div>

        {/* Widget 4: Completed Tasks */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{metrics.completedTasks}</div>
          <p className="text-[10px] text-slate-500">Processed successfully</p>
        </div>

        {/* Widget 5: Upcoming Schedules */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Upcoming Schedules</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{metrics.upcomingSchedules}</div>
          <p className="text-[10px] text-slate-500">Active schedule rules</p>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'board' && <WorkflowBoard />}
      {activeTab === 'queue' && <TaskQueue />}
      {activeTab === 'scheduler' && <SchedulerCalendar />}
      {activeTab === 'rules' && <AutomationRuleCard />}
      {activeTab === 'history' && <ExecutionHistory />}
    </div>
  );
};

export const WorkflowDashboard: React.FC = () => {
  return (
    <WorkflowProvider>
      <InnerWorkflowDashboard />
    </WorkflowProvider>
  );
};
