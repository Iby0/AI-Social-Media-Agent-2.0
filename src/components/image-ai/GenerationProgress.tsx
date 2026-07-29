import React from 'react';
import { Sparkles, Cpu, Layers, CheckCircle2 } from 'lucide-react';

interface GenerationProgressProps {
  stepMessage: string;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({ stepMessage }) => {
  return (
    <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
      {/* Central Pulsing Radar Loader */}
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400 animate-bounce" />
          AI Graphic Synthesis Engine
        </h3>
        <p className="text-sm font-medium text-cyan-300 animate-pulse">{stepMessage || 'Rendering high-resolution social graphic asset...'}</p>
        <p className="text-xs text-slate-400">
          Google Gemini Image API provider adapter processing geometry, color palette, and layout ratios.
        </p>
      </div>

      {/* Synthesis Step Pipeline */}
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto pt-2">
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            1. Prompt
          </div>
          <p className="text-[10px] text-slate-400">Context &amp; Brand</p>
        </div>

        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400">
            <Layers className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            2. Composition
          </div>
          <p className="text-[10px] text-slate-400">Aspect &amp; Vector</p>
        </div>

        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            3. Render
          </div>
          <p className="text-[10px] text-slate-400">High-Res PNG</p>
        </div>
      </div>
    </div>
  );
};
