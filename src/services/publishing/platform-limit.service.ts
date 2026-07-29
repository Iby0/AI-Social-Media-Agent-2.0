import { SocialPlatformType, PlatformLimitConfig } from '../../publishers/publisher.types';
import { FacebookPublisherAdapter } from '../../publishers/facebook.publisher';
import { InstagramPublisherAdapter } from '../../publishers/instagram.publisher';
import { LinkedInPublisherAdapter } from '../../publishers/linkedin.publisher';
import { GitHubPublisherAdapter } from '../../publishers/github.publisher';

export class PlatformLimitService {
  private static fb = new FacebookPublisherAdapter();
  private static ig = new InstagramPublisherAdapter();
  private static li = new LinkedInPublisherAdapter();
  private static gh = new GitHubPublisherAdapter();

  static getLimitsForPlatform(platform: SocialPlatformType): PlatformLimitConfig {
    switch (platform) {
      case 'facebook':
        return this.fb.getLimits();
      case 'instagram':
        return this.ig.getLimits();
      case 'linkedin':
        return this.li.getLimits();
      case 'github':
        return this.gh.getLimits();
      default:
        return {
          maxCaptionLength: 280,
          maxHashtags: 10,
          supportedMediaTypes: ['image'],
          maxMediaSizeMB: 5,
          supportsMultipleImages: false,
          supportsCTA: true,
          requiresMedia: false,
        };
    }
  }
}
