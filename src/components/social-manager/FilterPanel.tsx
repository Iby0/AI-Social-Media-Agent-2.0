import React from 'react';
import { useSocialAccounts } from './SocialAccountContext';
import { SearchBar } from './SearchBar';
import { AccountQueryOptions } from '../../services/social-manager/account-manager.service';
import { ArrowUpDown, LayoutGrid, Table as TableIcon } from 'lucide-react';

export interface FilterPanelProps {
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ viewMode, setViewMode }) => {
  const {
    statusFilter,
    setStatusFilter,
    platformFilter,
    setPlatformFilter,
    sortBy,
    setSortBy,
  } = useSocialAccounts();

  const statusFilters = [
    { id: 'All', label: 'All Statuses' },
    { id: 'Connected', label: 'Connected' },
    { id: 'Disconnected', label: 'Disconnected' },
    { id: 'Needs Attention', label: 'Needs Attention' },
  ];

  const platformFilters = [
    { id: 'All', label: 'All Platforms' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'github', label: 'GitHub' },
  ];

  const sortOptions: { id: AccountQueryOptions['sortBy']; label: string }[] = [
    { id: 'Recently Connected', label: 'Recently Connected' },
    { id: 'Platform', label: 'Platform' },
    { id: 'Health', label: 'Health Level' },
    { id: 'Status', label: 'Connection Status' },
    { id: 'Name', label: 'Account Name' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <SearchBar />

        {/* View mode toggle & Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {/* Sorting dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as AccountQueryOptions['sortBy'])}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              aria-label="Sort accounts"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-200">
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid Card View"
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Badges & Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
            Status:
          </span>
          {statusFilters.map((st) => {
            const active = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Platform Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
            Platform:
          </span>
          {platformFilters.map((pl) => {
            const active = platformFilter === pl.id;
            return (
              <button
                key={pl.id}
                onClick={() => setPlatformFilter(pl.id)}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {pl.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
