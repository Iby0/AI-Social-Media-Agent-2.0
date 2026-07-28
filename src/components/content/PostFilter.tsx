import React from 'react';
import { Filter, Layers, ArrowUpDown, Globe, Tag } from 'lucide-react';
import { CONTENT_CATEGORIES } from '../../services/content/content.utils';

interface PostFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  sortBy: 'newest' | 'oldest' | 'title';
  onSortChange: (sortBy: 'newest' | 'oldest' | 'title') => void;
  className?: string;
}

export const PostFilter: React.FC<PostFilterProps> = ({
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedPlatform,
  onPlatformChange,
  sortBy,
  onSortChange,
  className = '',
}) => {
  const statusOptions = [
    'All',
    'Draft',
    'Review',
    'Ready',
    'Scheduled',
    'Published',
    'Failed',
    'Archived',
  ];

  return (
    <div className={`space-y-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-md ${className}`}>
      {/* Top row: Status horizontal pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
          <Filter size={13} /> Status:
        </span>
        {statusOptions.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => onStatusChange(st)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              selectedStatus === st
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {st === 'All' ? 'All Posts' : st}
          </button>
        ))}
      </div>

      {/* Bottom row: Category, Platform, and Sorting dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
        {/* Category Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5">
          <Tag size={14} className="text-indigo-400 shrink-0" />
          <span className="text-xs text-slate-400 shrink-0">Category:</span>
          <select
            id="post-category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-slate-200">
              All Categories
            </option>
            {CONTENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5">
          <Globe size={14} className="text-indigo-400 shrink-0" />
          <span className="text-xs text-slate-400 shrink-0">Platform:</span>
          <select
            id="post-platform-filter"
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-slate-200">
              All Platforms
            </option>
            <option value="facebook" className="bg-slate-900 text-slate-200">
              Facebook
            </option>
            <option value="instagram" className="bg-slate-900 text-slate-200">
              Instagram
            </option>
            <option value="linkedin" className="bg-slate-900 text-slate-200">
              LinkedIn
            </option>
            <option value="twitter" className="bg-slate-900 text-slate-200">
              Twitter / X
            </option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5">
          <ArrowUpDown size={14} className="text-indigo-400 shrink-0" />
          <span className="text-xs text-slate-400 shrink-0">Sort By:</span>
          <select
            id="post-sort-filter"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'title')}
            className="w-full bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-slate-900 text-slate-200">
              Newest First
            </option>
            <option value="oldest" className="bg-slate-900 text-slate-200">
              Oldest First
            </option>
            <option value="title" className="bg-slate-900 text-slate-200">
              Title (A-Z)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};
