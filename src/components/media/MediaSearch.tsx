import React from 'react';
import { Input } from '../ui/Input';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { MediaSortOption } from '../../services/media/media.service';

interface MediaSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: MediaSortOption;
  onSortChange: (sort: MediaSortOption) => void;
}

export const MediaSearch: React.FC<MediaSearchProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Input
          placeholder="Search by name, category, or type..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 shrink-0">
          <ArrowUpDown className="h-3.5 w-3.5 text-indigo-400" />
          Sort by:
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as MediaSortOption)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="newest">Newest Uploaded First</option>
          <option value="oldest">Oldest First</option>
          <option value="name_asc">File Name (A - Z)</option>
          <option value="name_desc">File Name (Z - A)</option>
          <option value="size_desc">File Size (Largest)</option>
        </select>
      </div>
    </div>
  );
};
