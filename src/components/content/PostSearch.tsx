import React from 'react';
import { Search, X, Calendar, Tag, Filter } from 'lucide-react';

interface PostSearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const PostSearch: React.FC<PostSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search by Title, Caption, Category, Platform, or Hashtag...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
        <Search size={18} />
      </div>

      <input
        type="text"
        id="post-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
