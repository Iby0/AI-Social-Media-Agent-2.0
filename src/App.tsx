import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { PostStudio } from './components/PostStudio';
import { MediaLibraryView } from './components/MediaLibraryView';
import { CalendarView } from './components/CalendarView';
import { ChannelManager } from './components/ChannelManager';
import { AnalyticsView } from './components/AnalyticsView';
import { TemplateManager } from './components/TemplateManager';
import { ActivityLogs } from './components/ActivityLogs';
import { StorageDashboard } from './components/storage/StorageDashboard';
import { SettingsView } from './components/SettingsView';
import { HelpView } from './components/HelpView';
import { ContentLayout } from './components/content/ContentLayout';
import { SocialAccountPage } from './components/social/SocialAccountPage';
import { ChangelogView } from './components/ChangelogView';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { ProfileView } from './components/auth/ProfileView';
import { ProtectedRoute } from './middleware/ProtectedRoute';
import { AuthProvider } from './providers/AuthProvider';
import { SettingsProvider } from './providers/SettingsContext';
import { AIProvider } from './context/AIContext';
import { AIContentEngine } from './components/ai/AIContentEngine';
import { AIContentImageEngine } from './components/image-ai/ImageAIEngine';
import { WorkflowDashboard } from './components/workflow/WorkflowDashboard';
import { PublishDashboard } from './components/publishing/PublishDashboard';
import { AgentDashboard } from './components/agent/AgentDashboard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { BackupDashboard } from './components/backup/BackupDashboard';
import { PluginDashboard } from './components/plugins/PluginDashboard';

import { SystemProvider } from './context/SystemContext';
import { ErrorBoundary } from './components/system/ErrorBoundary';
import { OfflineNotice } from './components/system/OfflineNotice';
import { InstallPrompt } from './components/system/InstallPrompt';
import { UpdateNotification } from './components/system/UpdateNotification';

import { Post, SocialChannel, PromptTemplate, AnalyticsMetric, ActivityLog, BackupSettings, PostStatus } from './types';
import { db } from './lib/db';
import { INITIAL_CHANNELS, INITIAL_POSTS, INITIAL_TEMPLATES, INITIAL_ANALYTICS } from './data/mockData';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState<Post[]>([]);
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsMetric[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<BackupSettings | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Initialize IndexedDB Database Data
  const loadDatabase = async () => {
    setIsSyncing(true);
    try {
      let existingPosts = await db.getAllPosts();
      let existingChannels = await db.getAllChannels();
      let existingTemplates = await db.getAllTemplates();
      let existingAnalytics = await db.getAllAnalytics();
      let existingLogs = await db.getAllLogs();
      let existingSettings = await db.getSettings();

      // Seed default datasets if empty
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
        await db.logActivity('IndexedDB Initialized', 'system', 'Database initialized with Module 06 dataset', 'info');
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
    } fontFinally: {
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
              metrics: { impressions: 145, likes: 22, shares: 5, comments: 3 },
            };
            await db.savePost(updated);
            await db.logActivity('Auto-Publisher Executed', 'post', `Post "${p.title}" auto-published via schedule.`, 'success');
            updatedCount++;
          }
        }
      }

      if (updatedCount > 0) {
        loadDatabase();
      }
    }, 15000);

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

  const handleUseTemplate = (_template: PromptTemplate) => {
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

  // Render standalone Auth Screens if in login/register/forgot-password mode
  if (activeTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <LoginView
          onNavigateToRegister={() => setActiveTab('register')}
          onNavigateToForgotPassword={() => setActiveTab('forgot-password')}
          onSuccess={() => setActiveTab('dashboard')}
        />
      </div>
    );
  }

  if (activeTab === 'register') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <RegisterView
          onNavigateToLogin={() => setActiveTab('login')}
          onSuccess={() => setActiveTab('dashboard')}
        />
      </div>
    );
  }

  if (activeTab === 'forgot-password') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <ForgotPasswordView onNavigateToLogin={() => setActiveTab('login')} />
      </div>
    );
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      draftCount={draftCount}
      onSearchQuery={(q) => setSearchFilter(q)}
    >
      {/* Route: /dashboard */}
      {activeTab === 'dashboard' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <DashboardHome
            posts={posts}
            channels={channels}
            logs={logs}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/ai (AI Content Generation Engine) */}
      {activeTab === 'ai' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <AIContentEngine />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/image-ai (AI Image Generation Engine) */}
      {activeTab === 'image-ai' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <AIContentImageEngine />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/workflows (AI Scheduler & Automated Workflow Engine) */}
      {activeTab === 'workflows' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <WorkflowDashboard />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/publishing (Official Social Media Publishing Engine) */}
      {activeTab === 'publishing' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <PublishDashboard />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/agent (Autonomous AI Agent & Automation Engine) */}
      {activeTab === 'agent' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <AgentDashboard />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/content (Content Foundation Hub) */}
      {activeTab === 'content' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <ContentLayout initialTab="library" />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/create-post (Direct Create Post) */}
      {activeTab === 'create-post' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <ContentLayout initialTab="create" />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/studio (Content Generator) */}
      {activeTab === 'studio' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <PostStudio onSavePost={handleSavePost} templates={templates} onLogActivity={handleLogActivity} />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/media (Media Asset Library) */}
      {activeTab === 'media' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <MediaLibraryView />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/calendar (Scheduler) */}
      {activeTab === 'calendar' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <CalendarView
            posts={posts}
            onUpdatePostStatus={handleUpdatePostStatus}
            onDeletePost={handleDeletePost}
            onLogActivity={handleLogActivity}
          />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/channels or /dashboard/social (Social Accounts Hub) */}
      {(activeTab === 'channels' || activeTab === 'social') && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <SocialAccountPage />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/analytics */}
      {activeTab === 'analytics' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <AnalyticsDashboard />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/backup */}
      {activeTab === 'backup' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <BackupDashboard />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/plugins */}
      {activeTab === 'plugins' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <PluginDashboard />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/templates */}
      {activeTab === 'templates' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <TemplateManager
            templates={templates}
            onSaveTemplate={handleSaveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onUseTemplate={handleUseTemplate}
          />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/logs */}
      {activeTab === 'logs' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <ActivityLogs logs={logs} />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/storage */}
      {activeTab === 'storage' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <StorageDashboard />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/settings */}
      {activeTab === 'settings' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onLogActivity={handleLogActivity}
            onReloadData={loadDatabase}
          />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/profile */}
      {activeTab === 'profile' && (
        <ProtectedRoute onRedirectToLogin={() => setActiveTab('login')}>
          <ProfileView />
        </ProtectedRoute>
      )}

      {/* Route: /dashboard/help */}
      {activeTab === 'help' && <HelpView />}

      {/* Route: /dashboard/changelog */}
      {activeTab === 'changelog' && <ChangelogView />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SystemProvider>
        <AuthProvider>
          <SettingsProvider>
            <AIProvider>
              <AppContent />
              <OfflineNotice />
              <InstallPrompt />
              <UpdateNotification />
            </AIProvider>
          </SettingsProvider>
        </AuthProvider>
      </SystemProvider>
    </ErrorBoundary>
  );
}
