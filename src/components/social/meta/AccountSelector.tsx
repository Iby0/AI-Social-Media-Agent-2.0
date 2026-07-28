import React, { useState } from 'react';
import { Check, X, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { FacebookPageSelectOption } from '../../../social/adapters/facebook/facebook.types';
import { InstagramBusinessSelectOption } from '../../../social/adapters/instagram/instagram.types';
import { PlatformIcon } from '../PlatformIcon';

interface AccountSelectorProps {
  platform: 'facebook' | 'instagram';
  facebookPages?: FacebookPageSelectOption[];
  instagramAccounts?: InstagramBusinessSelectOption[];
  onSelectFacebookPage?: (page: FacebookPageSelectOption) => void;
  onSelectInstagramAccount?: (account: InstagramBusinessSelectOption) => void;
  onClose: () => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  platform,
  facebookPages = [],
  instagramAccounts = [],
  onSelectFacebookPage,
  onSelectInstagramAccount,
  onClose,
}) => {
  const [selectedFbIndex, setSelectedFbIndex] = useState<number>(0);
  const [selectedIgIndex, setSelectedIgIndex] = useState<number>(0);

  const handleConfirm = () => {
    if (platform === 'facebook' && facebookPages.length > 0 && onSelectFacebookPage) {
      onSelectFacebookPage(facebookPages[selectedFbIndex]);
    } else if (platform === 'instagram' && instagramAccounts.length > 0 && onSelectInstagramAccount) {
      onSelectInstagramAccount(instagramAccounts[selectedIgIndex]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={platform} size="md" />
            <div>
              <h3 className="font-extrabold text-slate-100 text-sm">
                Select {platform === 'facebook' ? 'Facebook Page' : 'Instagram Business Account'}
              </h3>
              <p className="text-xs text-slate-400">
                Choose the official brand entity to authorize for social operations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Facebook Page Selection List */}
        {platform === 'facebook' && (
          <div className="mt-4 space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {facebookPages.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No Facebook Pages found under this account.</p>
            ) : (
              facebookPages.map((page, idx) => {
                const isSelected = selectedFbIndex === idx;
                return (
                  <button
                    key={page.pageId}
                    type="button"
                    onClick={() => setSelectedFbIndex(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={page.pageAvatar}
                        alt={page.pageName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-100 truncate">{page.pageName}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          @{page.pageUsername || page.pageId} • {page.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
                        {page.fanCount?.toLocaleString() || 0} fans
                      </span>
                      {isSelected && <Check size={16} className="text-indigo-400 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Instagram Business Selection List */}
        {platform === 'instagram' && (
          <div className="mt-4 space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {instagramAccounts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No connected Instagram Business accounts found. Make sure your Instagram account is converted to Business/Creator and linked to a Facebook Page.
              </p>
            ) : (
              instagramAccounts.map((ig, idx) => {
                const isSelected = selectedIgIndex === idx;
                return (
                  <button
                    key={ig.instagramId}
                    type="button"
                    onClick={() => setSelectedIgIndex(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={ig.profilePicture}
                        alt={ig.username}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-100 truncate">@{ig.username}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          Linked Page: {ig.facebookPageName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
                        {ig.followersCount?.toLocaleString() || 0} followers
                      </span>
                      {isSelected && <Check size={16} className="text-indigo-400 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <span>Confirm Connection</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
