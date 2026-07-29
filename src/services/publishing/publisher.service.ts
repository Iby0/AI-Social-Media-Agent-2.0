import { IPublisherAdapter } from '../../publishers/publisher.interface';
import { FacebookPublisherAdapter } from '../../publishers/facebook.publisher';
import { InstagramPublisherAdapter } from '../../publishers/instagram.publisher';
import { LinkedInPublisherAdapter } from '../../publishers/linkedin.publisher';
import { GitHubPublisherAdapter } from '../../publishers/github.publisher';
import {
  PublishRequest,
  PublishResponse,
  SocialPlatformType,
  PublishHistoryRecord,
} from '../../publishers/publisher.types';
import { ValidationService } from './validation.service';
import { HistoryService } from './history.service';

export class PublisherService {
  private adapters: Map<SocialPlatformType, IPublisherAdapter> = new Map();

  constructor() {
    this.registerAdapter(new FacebookPublisherAdapter());
    this.registerAdapter(new InstagramPublisherAdapter());
    this.registerAdapter(new LinkedInPublisherAdapter());
    this.registerAdapter(new GitHubPublisherAdapter());
  }

  registerAdapter(adapter: IPublisherAdapter): void {
    this.adapters.set(adapter.platform as SocialPlatformType, adapter);
  }

  async publish(request: PublishRequest): Promise<PublishResponse> {
    const adapter = this.adapters.get(request.platform);

    if (!adapter) {
      const response: PublishResponse = {
        success: false,
        publishedTime: new Date().toISOString(),
        responseCode: 400,
        errorMessage: `No official publisher adapter registered for platform '${request.platform}'`,
        durationMs: 0,
      };

      HistoryService.addRecord({
        id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        requestId: request.id,
        postId: request.postId,
        postTitle: request.postTitle,
        platform: request.platform,
        result: response,
        publishedTime: new Date().toISOString(),
        durationMs: 0,
        retryCount: request.retryCount,
      });

      return response;
    }

    // Validation step
    const validation = ValidationService.validatePublishRequest(request);
    if (!validation.valid) {
      const response: PublishResponse = {
        success: false,
        publishedTime: new Date().toISOString(),
        responseCode: 422,
        errorMessage: validation.errors.join('; '),
        durationMs: 0,
      };

      HistoryService.addRecord({
        id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        requestId: request.id,
        postId: request.postId,
        postTitle: request.postTitle,
        platform: request.platform,
        result: response,
        publishedTime: new Date().toISOString(),
        durationMs: 0,
        retryCount: request.retryCount,
      });

      return response;
    }

    // Execute Official API call
    const result = await adapter.publish(request);

    // Save to history
    HistoryService.addRecord({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      requestId: request.id,
      postId: request.postId,
      postTitle: request.postTitle,
      platform: request.platform,
      result,
      publishedTime: result.publishedTime,
      durationMs: result.durationMs,
      retryCount: request.retryCount,
    });

    return result;
  }
}

export const publisherService = new PublisherService();
