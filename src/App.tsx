import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PostStudio } from './components/PostStudio';
import { CalendarView } from './components/CalendarView';
import { ChannelManager } from './components/ChannelManager';
import { AnalyticsView } from './components/AnalyticsView';
import { TemplateManager } from './components/TemplateManager';
import { ActivityLogs } from './components/ActivityLogs';
import { SettingsView } from './components/SettingsView';
import { ChangelogView } from './components/ChangelogView';

import { Post, SocialChannel, PromptTemplate, AnalyticsMetric, ActivityLog, BackupSettings, PostStatus } from './types';
import { db } from './lib/db';
import { INITIAL_CHANNELS, INITIAL_POSTS, INITIAL_TEMPLATES, INITIAL_ANALYTICS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [posts, setPosts] = useState<Post[]>([]);
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsMetric[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<BackupSettings | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize IndexedDB Data
  const loadDatabase = async () => {
    setIsSyncing(true);
    try {
      let existingPosts = await db.getAllPosts();
      let existingChannels = await db.getAllChannels();
      let existingTemplates = await db.getAllTemplates();
      let existingAnalytics = await db.getAllAnalytics();
      let existingLogs = await db.getAllLogs();
      let existingSettings = await db.getSettings();

      // Seed if empty
      if (existingPosts.length === 0) {
        for (const p of INITIAL_POSTS) await db.savePost(p);
        existingPosts = INITIAL_POSTS;
      }
      if (existingChannels.length === 0) {
        for (const c of INITIAL_CHANNELS) await db.saveChannel(c);
        existingChannels = INITIAL_CHANNELS;
      }
      if (existingTemplates.length === 0) {
        for (const t of INITIAL_TEMPLATES) await db.saveTemplate(t);
        existingTemplates = INITIAL_TEMPLATES;
      }
      if (existingAnalytics.length === 0) {
        await db.saveAnalytics(INITIAL_ANALYTICS);
        existingAnalytics = INITIAL_ANALYTICS;
      }
      if (existingLogs.length === 0) {
        await db.logActivity('IndexedDB Initialized', 'system', 'Database initialized with seed dataset', 'info');
        existingLogs = await db.getAllLogs();
      }

      setPosts(existingPosts);
      setChannels(existingChannels);
      setTemplates(existingTemplates);
      setAnalytics(existingAnalytics);
      setLogs(existingLogs);
      setSettings(existingSettings);
    } catch (err) {
      console.error('IndexedDB Load Error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Background Auto-Scheduler Engine
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      let updatedCount = 0;

      for (const p of posts) {
        if (p.status === 'scheduled' && p.scheduledAt) {
          const schedDate = new Date(p.scheduledAt);
          if (schedDate <= now) {
            const updated: Post = {
              ...p,
              status: 'published',
              publishedAt: now.toISOString(),
              metrics: { impressions: 120, likes: 14, shares: 3, comments: 2 },
            };
            await db.savePost(updated);
            await db.logActivity('Auto-Publisher Executed', 'post', `Post "${p.title}" auto-published.`, 'success');
            updatedCount++;
          }
        }
      }

      if (updatedCount > 0) {
        loadDatabase();
      }
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [posts]);

  // Handlers
  const handleSavePost = async (post: Post) => {
    await db.savePost(post);
    await loadDatabase();
    if (post.status === 'scheduled' || post.status === 'published') {
      setActiveTab('calendar');
    }
  };

  const handleUpdatePostStatus = async (postId: string, newStatus: PostStatus) => {
    const found = posts.find((p) => p.id === postId);
    if (found) {
      const updated: Post = {
        ...found,
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : found.publishedAt,
      };
      await db.savePost(updated);
      await loadDatabase();
    }
  };

  const handleDeletePost = async (postId: string) => {
    await db.deletePost(postId);
    await loadDatabase();
  };

  const handleSaveChannel = async (channel: SocialChannel) => {
    await db.saveChannel(channel);
    await loadDatabase();
  };

  const handleSaveTemplate = async (template: PromptTemplate) => {
    await db.saveTemplate(template);
    await loadDatabase();
  };

  const handleDeleteTemplate = async (id: string) => {
    await db.deleteTemplate(id);
    await loadDatabase();
  };

  const handleUseTemplate = (template: PromptTemplate) => {
    setActiveTab('studio');
  };

  const handleSaveSettings = async (newSettings: BackupSettings) => {
    await db.saveSettings(newSettings);
    await loadDatabase();
  };

  const handleLogActivity = async (action: string, category: ActivityLog['category'], details: string, status?: ActivityLog['status']) => {
    await db.logActivity(action, category, details, status);
    const updatedLogs = await db.getAllLogs();
    setLogs(updatedLogs);
  };

  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        channels={channels}
        posts={posts}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshData={loadDatabase}
        isSyncing={isSyncing}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} draftCount={draftCount} />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'studio' && (
            <PostStudio onSavePost={handleSavePost} templates={templates} onLogActivity={handleLogActivity} />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              posts={posts}
              onUpdatePostStatus={handleUpdatePostStatus}
              onDeletePost={handleDeletePost}
              onLogActivity={handleLogActivity}
            />
          )}

          {activeTab === 'channels' && (
            <ChannelManager channels={channels} onSaveChannel={handleSaveChannel} onLogActivity={handleLogActivity} />
          )}

          {activeTab === 'analytics' && <AnalyticsView analytics={analytics} posts={posts} />}

          {activeTab === 'templates' && (
            <TemplateManager
              templates={templates}
              onSaveTemplate={handleSaveTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onUseTemplate={handleUseTemplate}
            />
          )}

          {activeTab === 'logs' && <ActivityLogs logs={logs} />}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onLogActivity={handleLogActivity}
              onReloadData={loadDatabase}
            />
          )}

          {activeTab === 'changelog' && <ChangelogView />}
        </main>
      </div>
    </div>
  );
}
