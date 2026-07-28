import React, { useState } from 'react';
import { Search, Filter, Plus, Layers, AlertCircle } from 'lucide-react';
import { SocialAccountRecord } from '../../database/types';
import { SocialAccountCard } from './SocialAccountCard';
import { ConnectButton } from './ConnectButton';

interface SocialAccountListProps {
  accounts: SocialAccountRecord[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  onConnectClick: () => void;
  onRefreshList: () => void;
}

export const SocialAccountList: React.FC<SocialAccountListProps> = ({
  accounts,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPlatform,
  onPlatformChange,
  onConnectClick,
  onRefreshList,
}) => {
  const platforms = ['All', 'Facebook', 'Instagram', 'LinkedIn', 'GitHub'];
  const statuses = ['All', 'Connected', 'Disconnected', 'Expired', 'Error', 'Pending'];

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl shadow-md">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search connected platforms, account names, or IDs..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl">
            <Filter size={13} className="text-slate-400" />
            <select
              value={selectedPlatform}
              onChange={(e) => onPlatformChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              {platforms.map((p) => (
                <option key={p} value={p} className="bg-slate-900 text-slate-200">
                  {p === 'All' ? 'All Platforms' : p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-slate-200">
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Account Grid or Loading/Empty State */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading connected social accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-800/80 rounded-2xl p-8 bg-slate-900/30">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Layers size={22} />
          </div>
          <h3 className="font-extrabold text-slate-200 text-base mb-1">No Accounts Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            No connected social media accounts match your filter criteria. Connect a new platform or clear search filters.
          </p>
          <ConnectButton onClick={onConnectClick} label="Connect Social Platform" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <SocialAccountCard key={acc.id} account={acc} onRefreshList={onRefreshList} />
          ))}
        </div>
      )}
    </div>
  );
};
