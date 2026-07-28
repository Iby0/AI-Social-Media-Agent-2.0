import React from 'react';
import { FileCode2, CheckCircle2, Cpu, HardDrive, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const ChangelogView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-indigo-400" />
              Master Development Instructions & CHANGELOG
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              v2.0.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete architectural changelog, file system overview, and modular engineering verification.
          </p>
        </div>
      </div>

      {/* Release Notes Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Social Media Agent — Version 2.0 Release</h3>
            <p className="text-xs text-slate-400">Architectural Foundation, Gemini AI Engine, & IndexedDB Storage</p>
          </div>
        </div>

        {/* Engineering Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" /> Server-Side Express Proxy
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-stack Express server listening on port 3000 at 0.0.0.0. Handles Gemini API calls server-side (`@google/genai`) to ensure API key security.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-cyan-400" /> Offline-First IndexedDB Engine
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Custom promise-wrapped IndexedDB driver (`AISocialAgentDB`) storing posts, channels, templates, analytics metrics, and activity logs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Multi-Channel Management
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official API configuration for Facebook Page API, Instagram Business API, LinkedIn API v2, and GitHub REST/GraphQL.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-pink-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-pink-400" /> Content Studio & Planner
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simultaneous multi-platform post generator, live preview cards, AI visual prompt creator, content calendar, and analytics insights.
            </p>
          </div>
        </div>

        {/* Modules Verification List */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Completed System Modules</h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Module 1 — Backend Infrastructure & Express Server:</strong> `/server.ts` configured with Express, `@google/genai` Gemini SDK, and Vite dev proxy.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Module 2 — IndexedDB Persistence Layer:</strong> `/src/lib/db.ts` promise-wrapped database engine with export/import JSON capability.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Module 3 — AI Content Studio:</strong> `/src/components/PostStudio.tsx` multi-platform caption synthesis, tone customization, visual prompts.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Module 4 — Social Channel Integration:</strong> `/src/components/ChannelManager.tsx` token validation and auto-publishing rules.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Module 5 — Content Calendar & Scheduler:</strong> `/src/components/CalendarView.tsx` status queue management and scheduling engine.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span><strong>Module 6 — Analytics & Activity Logs:</strong> `/src/components/AnalyticsView.tsx` & `/src/components/ActivityLogs.tsx` cross-platform audience insights.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
