import React from 'react';
import { AspectRatio, ImageType } from '../../types/image-ai';
import { Layout, Maximize2 } from 'lucide-react';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  selectedType: ImageType;
  onSelectRatio: (ratio: AspectRatio) => void;
  onSelectType: (type: ImageType) => void;
}

const IMAGE_TYPES_MAP: Array<{
  type: ImageType;
  defaultRatio: AspectRatio;
  label: string;
  recommendedFor: string;
}> = [
  { type: 'Facebook Post', defaultRatio: '16:9', label: 'Facebook Post', recommendedFor: '1200x630' },
  { type: 'Instagram Square', defaultRatio: '1:1', label: 'Instagram Square', recommendedFor: '1080x1080' },
  { type: 'Instagram Story', defaultRatio: '9:16', label: 'Instagram Story', recommendedFor: '1080x1920' },
  { type: 'LinkedIn Banner', defaultRatio: '4:1', label: 'LinkedIn Banner', recommendedFor: '1584x396' },
  { type: 'GitHub Social Image', defaultRatio: '16:9', label: 'GitHub Social', recommendedFor: '1200x600' },
  { type: 'Blog Cover', defaultRatio: '16:9', label: 'Blog Cover', recommendedFor: '1200x630' },
  { type: 'Quote Card', defaultRatio: '1:1', label: 'Quote Card', recommendedFor: '1080x1080' },
  { type: 'Announcement', defaultRatio: '16:9', label: 'Announcement', recommendedFor: '1200x630' },
  { type: 'Marketing Banner', defaultRatio: '16:9', label: 'Marketing Banner', recommendedFor: '1200x628' },
  { type: 'Technology Illustration', defaultRatio: '3:2', label: 'Tech Illustration', recommendedFor: '1200x800' },
];

const RATIOS: Array<{ ratio: AspectRatio; label: string; iconBox: string }> = [
  { ratio: '1:1', label: 'Square (1:1)', iconBox: 'w-5 h-5' },
  { ratio: '16:9', label: 'Landscape (16:9)', iconBox: 'w-7 h-4' },
  { ratio: '9:16', label: 'Portrait / Story (9:16)', iconBox: 'w-4 h-7' },
  { ratio: '4:3', label: 'Standard (4:3)', iconBox: 'w-6 h-4.5' },
  { ratio: '4:1', label: 'Banner (4:1)', iconBox: 'w-8 h-2.5' },
  { ratio: '3:2', label: 'Classic (3:2)', iconBox: 'w-6 h-4' },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  selectedRatio,
  selectedType,
  onSelectRatio,
  onSelectType,
}) => {
  const handleTypeClick = (item: (typeof IMAGE_TYPES_MAP)[0]) => {
    onSelectType(item.type);
    onSelectRatio(item.defaultRatio);
  };

  return (
    <div className="space-y-4">
      {/* 1. Image Type Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Layout className="w-4 h-4 text-cyan-400" />
          Supported Social Image Asset Format
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {IMAGE_TYPES_MAP.map((item) => {
            const isSelected = selectedType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleTypeClick(item)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500/40 text-cyan-200'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="text-xs font-semibold truncate">{item.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.recommendedFor}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Aspect Ratio Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-blue-400" />
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {RATIOS.map((r) => {
            const isSelected = selectedRatio === r.ratio;
            return (
              <button
                key={r.ratio}
                type="button"
                onClick={() => onSelectRatio(r.ratio)}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-bold ring-1 ring-blue-500/30'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className={`border-2 border-current rounded-sm ${r.iconBox}`} />
                <span className="text-xs">{r.ratio}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
