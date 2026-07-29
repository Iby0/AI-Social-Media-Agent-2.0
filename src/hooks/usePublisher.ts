import { usePublishingContext } from '../context/PublishingContext';

export function usePublisher() {
  const context = usePublishingContext();

  return {
    pendingQueue: context.pendingQueue,
    publishingQueue: context.publishingQueue,
    publishedItems: context.publishedItems,
    failedQueue: context.failedQueue,
    retryQueue: context.retryQueue,
    addToQueue: context.addToQueue,
    publishNow: context.publishNow,
    retryFailed: context.retryFailed,
    cancelRequest: context.cancelRequest,
    isPublishing: context.isPublishing,
  };
}
