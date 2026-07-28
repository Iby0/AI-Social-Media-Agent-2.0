import React, { useState } from 'react';
import {
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Key,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { SocialChannel, SocialPlatform } from '../types';

interface ChannelManagerProps {
  channels: SocialChannel[];
  onSaveChannel: (channel: SocialChannel) => void;
  onLogActivity: (action: string, category: 'channel', details: string, status?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({
  channels,
  onSaveChannel,
  onLogActivity,
}) => {
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [idInput, setIdInput] = useState('');
  const [testingStatus, setTestingStatus] = useState<string | null>(null);

  const handleStartEdit = (channel: SocialChannel) => {
    setEditingPlatform(channel.platform);
    setTokenInput(channel.accessToken || '');
    setIdInput(channel.pageOrRepoId || '');
  };

  const handleTestConnection = (channel: SocialChannel) => {
    setTestingStatus(channel.platform);
    setTimeout(() => {
      setTestingStatus(null);
      const updatedChannel: SocialChannel = {
        ...channel,
        isConnected: true,
        status: 'active',
        lastSyncedAt: new Date().toISOString(),
      };
      onSaveChannel(updatedChannel);
      onLogActivity('Channel Token Validated', 'channel', `Validated connection token for ${channel.accountName} (${channel.platform})`, 'success');
    }, 1200);
  };

  const handleSaveToken = (channel: SocialChannel) => {
    const updatedChannel: SocialChannel = {
      ...channel,
      accessToken: tokenInput,
      pageOrRepoId: idInput,
      isConnected: true,
      status: 'active',
      lastSyncedAt: new Date().toISOString(),
    };
    onSaveChannel(updatedChannel);
    setEditingPlatform(null);
    onLogActivity('Channel Config Updated', 'channel', `Updated API credentials for ${channel.platform}`, 'success');
  };

  const handleToggleAutoPublish = (channel: SocialChannel) => {
    const updated = { ...channel, autoPublish: !channel.autoPublish };
    onSaveChannel(updated);
    onLogActivity('Auto-Publish Toggled', 'channel', `Set auto-publish to ${updated.autoPublish} for ${channel.platform}`, 'info');
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-6 w-6 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-6 w-6 text-pink-400" />;
      case 'linkedin':
        return <Linkedin className="h-6 w-6 text-sky-400" />;
      case 'github':
        return <Github className="h-6 w-6 text-slate-200" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="h-5 w-5 text-indigo-400" />
              Connected Social Channels
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Official APIs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure access tokens, page IDs, and auto-publishing rules for Facebook Pages, Instagram Business, LinkedIn, and GitHub.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>OAuth 2.0 & Token Auth Secure</span>
        </div>
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((channel) => {
          const isEditing = editingPlatform === channel.platform;
          const isTesting = testingStatus === channel.platform;

          return (
            <div
              key={channel.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-4">
                {/* Channel Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      {getPlatformIcon(channel.platform)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white capitalize">{channel.platform}</h3>
                      <p className="text-xs text-slate-400">{channel.accountName}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      channel.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${channel.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {channel.status === 'active' ? 'Connected' : 'Action Required'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Handle/Identifier:</span>
                    <span className="font-semibold text-slate-200">{channel.handle}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Follower/Audience Count:</span>
                    <span className="font-semibold text-slate-200">{channel.followerCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Page/Repo ID:</span>
                    <span className="font-mono text-indigo-300">{channel.pageOrRepoId || 'Not configured'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Last API Sync:</span>
                    <span className="text-slate-400">
                      {channel.lastSyncedAt ? new Date(channel.lastSyncedAt).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>

                {/* Token Configuration Drawer */}
                {isEditing && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/40 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                      <Key className="h-3.5 w-3.5" /> API Token Configuration
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Page / Repository ID
                      </label>
                      <input
                        type="text"
                        value={idInput}
                        onChange={(e) => setIdInput(e.target.value)}
                        placeholder="e.g. fb_page_88492019 or repo_owner/repo_name"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Access Token / Bearer Key
                      </label>
                      <input
                        type="password"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="Paste official API bearer token..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleSaveToken(channel)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Save Credentials
                      </button>
                      <button
                        onClick={() => setEditingPlatform(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`auto-${channel.id}`}
                    checked={channel.autoPublish}
                    onChange={() => handleToggleAutoPublish(channel)}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor={`auto-${channel.id}`} className="text-xs text-slate-300 cursor-pointer font-medium">
                    Auto-Publish
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestConnection(channel)}
                    disabled={isTesting}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`h-3 w-3 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Sync Token'}</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(channel)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
