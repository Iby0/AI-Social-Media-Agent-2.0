import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PublishRequest,
  PublishResponse,
  PublishHistoryRecord,
  SocialPlatformType,
} from '../publishers/publisher.types';
import { publisherService } from '../services/publishing/publisher.service';
import { HistoryService } from '../services/publishing/history.service';

interface PublishingContextType {
  pendingQueue: PublishRequest[];
  publishingQueue: PublishRequest[];
  publishedItems: PublishHistoryRecord[];
  failedQueue: PublishRequest[];
  retryQueue: PublishRequest[];
  addToQueue: (request: Omit<PublishRequest, 'id' | 'retryCount'>) => void;
  publishNow: (requestId: string) => Promise<PublishResponse | null>;
  retryFailed: (requestId: string) => Promise<PublishResponse | null>;
  cancelRequest: (requestId: string) => void;
  clearHistory: () => void;
  isPublishing: boolean;
  refreshHistory: () => void;
}

const PublishingContext = createContext<PublishingContextType | undefined>(undefined);

const SAMPLE_INITIAL_QUEUE: PublishRequest[] = [
  {
    id: 'req_101',
    postId: 'post_201',
    postTitle: 'AI Social Engine V2 Official Launch Announcement',
    platform: 'facebook',
    caption: '🚀 We are thrilled to introduce the Official Social Media Publishing Engine! Automate cross-platform scheduling using official APIs seamlessly.',
    hashtags: ['TechNews', 'SocialAutomation', 'AIEngine', 'GrowthProductivity'],
    ctaUrl: 'https://ais.studio/release-v2',
    visibility: 'public',
    retryCount: 0,
    maxRetries: 3,
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'req_102',
    postId: 'post_202',
    postTitle: 'Visual Architecture & Container Flow Infographic',
    platform: 'instagram',
    caption: 'Behind the scenes of our high-scale enterprise publishing architecture! Powered strictly by official Graph APIs.',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        altText: 'Abstract System Architecture Diagram',
      },
    ],
    hashtags: ['TechDesign', 'CloudArchitecture', 'InstagramAPI', 'Engineering'],
    visibility: 'public',
    retryCount: 0,
    maxRetries: 3,
    scheduledAt: new Date(Date.now() + 7200000).toISOString(),
  },
  {
    id: 'req_103',
    postId: 'post_203',
    postTitle: 'Q3 Enterprise Social Automation Benchmark Report',
    platform: 'linkedin',
    caption: 'Key insights from our latest Q3 benchmark on multi-channel content engagement and official REST API delivery metrics.',
    hashtags: ['EnterpriseIT', 'SocialMediaAPI', 'MarketingAnalytics'],
    ctaUrl: 'https://ais.studio/benchmark-report',
    visibility: 'public',
    retryCount: 0,
    maxRetries: 3,
    scheduledAt: new Date(Date.now() + 10800000).toISOString(),
  },
  {
    id: 'req_104',
    postId: 'post_204',
    postTitle: 'Publishing Engine v19.0 API Release Notes',
    platform: 'github',
    caption: 'Official Release Notes for Publisher Engine Module 19. Features native support for Facebook Pages, Instagram Business, LinkedIn UGC, and GitHub Gist endpoints.',
    hashtags: ['OpenSource', 'GitHubAPI', 'ReleaseNotes'],
    visibility: 'public',
    retryCount: 0,
    maxRetries: 3,
    scheduledAt: new Date(Date.now() + 14400000).toISOString(),
  },
];

export const PublishingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingQueue, setPendingQueue] = useState<PublishRequest[]>(() => {
    const saved = localStorage.getItem('ai_publishing_pending_queue');
    return saved ? JSON.parse(saved) : SAMPLE_INITIAL_QUEUE;
  });

  const [publishingQueue, setPublishingQueue] = useState<PublishRequest[]>([]);
  const [failedQueue, setFailedQueue] = useState<PublishRequest[]>(() => {
    const saved = localStorage.getItem('ai_publishing_failed_queue');
    return saved ? JSON.parse(saved) : [];
  });
  const [retryQueue, setRetryQueue] = useState<PublishRequest[]>([]);
  const [publishedItems, setPublishedItems] = useState<PublishHistoryRecord[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const refreshHistory = useCallback(() => {
    setPublishedItems(HistoryService.getHistory());
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  useEffect(() => {
    localStorage.setItem('ai_publishing_pending_queue', JSON.stringify(pendingQueue));
  }, [pendingQueue]);

  useEffect(() => {
    localStorage.setItem('ai_publishing_failed_queue', JSON.stringify(failedQueue));
  }, [failedQueue]);

  const addToQueue = useCallback((requestData: Omit<PublishRequest, 'id' | 'retryCount'>) => {
    const newReq: PublishRequest = {
      ...requestData,
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      retryCount: 0,
      maxRetries: requestData.maxRetries || 3,
    };
    setPendingQueue((prev) => [newReq, ...prev]);
  }, []);

  const publishNow = useCallback(
    async (requestId: string): Promise<PublishResponse | null> => {
      const target =
        pendingQueue.find((r) => r.id === requestId) ||
        failedQueue.find((r) => r.id === requestId) ||
        retryQueue.find((r) => r.id === requestId);

      if (!target) return null;

      setIsPublishing(true);
      // Move to active publishing queue
      setPendingQueue((prev) => prev.filter((r) => r.id !== requestId));
      setFailedQueue((prev) => prev.filter((r) => r.id !== requestId));
      setRetryQueue((prev) => prev.filter((r) => r.id !== requestId));
      setPublishingQueue((prev) => [...prev, target]);

      try {
        const response = await publisherService.publish(target);

        setPublishingQueue((prev) => prev.filter((r) => r.id !== requestId));

        if (response.success) {
          refreshHistory();
        } else {
          const updatedReq = { ...target, retryCount: target.retryCount + 1 };
          if (updatedReq.retryCount < (updatedReq.maxRetries || 3)) {
            setRetryQueue((prev) => [...prev, updatedReq]);
          } else {
            setFailedQueue((prev) => [...prev, updatedReq]);
          }
        }

        setIsPublishing(false);
        return response;
      } catch (err) {
        setPublishingQueue((prev) => prev.filter((r) => r.id !== requestId));
        const updatedReq = { ...target, retryCount: target.retryCount + 1 };
        setFailedQueue((prev) => [...prev, updatedReq]);
        setIsPublishing(false);
        return null;
      }
    },
    [pendingQueue, failedQueue, retryQueue, refreshHistory]
  );

  const retryFailed = useCallback(
    async (requestId: string) => {
      return await publishNow(requestId);
    },
    [publishNow]
  );

  const cancelRequest = useCallback((requestId: string) => {
    setPendingQueue((prev) => prev.filter((r) => r.id !== requestId));
    setFailedQueue((prev) => prev.filter((r) => r.id !== requestId));
    setRetryQueue((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  const handleClearHistory = useCallback(() => {
    HistoryService.clearHistory();
    setPublishedItems([]);
  }, []);

  return (
    <PublishingContext.Provider
      value={{
        pendingQueue,
        publishingQueue,
        publishedItems,
        failedQueue,
        retryQueue,
        addToQueue,
        publishNow,
        retryFailed,
        cancelRequest,
        clearHistory: handleClearHistory,
        isPublishing,
        refreshHistory,
      }}
    >
      {children}
    </PublishingContext.Provider>
  );
};

export const usePublishingContext = () => {
  const context = useContext(PublishingContext);
  if (!context) {
    throw new Error('usePublishingContext must be used within a PublishingProvider');
  }
  return context;
};
