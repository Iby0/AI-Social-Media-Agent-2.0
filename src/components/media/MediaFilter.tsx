import React from 'react';
import { Filter, Layers, UploadCloud, Sparkles, Image as ImageIcon, Clock } from 'lucide-react';

export type CategoryFilterType = 'All' | 'Uploaded' | 'Generated' | 'Post Images' | 'Temporary';

interface MediaFilterProps {
  activeFilter: CategoryFilterType;
  onFilterChange: (filter: CategoryFilterType) => void;
  counts: Record<CategoryFilterType, number>;
}

export const MediaFilter: React.FC<MediaFilterProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const tabs: { key: CategoryFilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'All', label: 'All Media', icon: <Layers className="h-3.5 w-3.5" /> },
    { key: 'Uploaded', label: 'Uploaded', icon: <UploadCloud className="h-3.5 w-3.5" /> },
    { key: 'Generated', label: 'AI Generated', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { key: 'Post Images', label: 'Post Images', icon: <ImageIcon className="h-3.5 w-3.5" /> },
    { key: 'Temporary', label: 'Temporary', icon: <Clock className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-800">
      <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1.5 shrink-0">
        <Filter className="h-3.5 w-3.5 text-indigo-400" />
        Filter Category:
      </span>

      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          const count = counts[tab.key] || 0;

          return (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
