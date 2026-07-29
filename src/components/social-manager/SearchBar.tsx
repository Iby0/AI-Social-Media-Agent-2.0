import React from 'react';
import { useSocialAccounts } from './SocialAccountContext';
import { Search, X } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSocialAccounts();

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search accounts by platform, name, or account ID..."
        aria-label="Search accounts"
        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded-md"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
