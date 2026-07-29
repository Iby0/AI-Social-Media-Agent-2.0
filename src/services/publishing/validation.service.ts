import { PublishRequest, PlatformValidationResult } from '../../publishers/publisher.types';
import { FacebookPublisherAdapter } from '../../publishers/facebook.publisher';
import { InstagramPublisherAdapter } from '../../publishers/instagram.publisher';
import { LinkedInPublisherAdapter } from '../../publishers/linkedin.publisher';
import { GitHubPublisherAdapter } from '../../publishers/github.publisher';

export class ValidationService {
  private static fb = new FacebookPublisherAdapter();
  private static ig = new InstagramPublisherAdapter();
  private static li = new LinkedInPublisherAdapter();
  private static gh = new GitHubPublisherAdapter();

  static validatePublishRequest(request: PublishRequest): PlatformValidationResult {
    switch (request.platform) {
      case 'facebook':
        return this.fb.validateRequest(request);
      case 'instagram':
        return this.ig.validateRequest(request);
      case 'linkedin':
        return this.li.validateRequest(request);
      case 'github':
        return this.gh.validateRequest(request);
      default:
        return {
          valid: true,
          errors: [],
          warnings: ['Platform uses default API publishing specifications.'],
        };
    }
  }
}
