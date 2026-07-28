import {
  ISocialAdapter,
  SocialPlatform,
  PlatformAdapterConfig,
  FacebookAdapter,
  InstagramAdapter,
  LinkedInAdapter,
  GitHubAdapter,
} from '../../social';

export class PlatformService {
  private adapters: Map<SocialPlatform, ISocialAdapter> = new Map();

  constructor() {
    this.registerAdapter(new FacebookAdapter());
    this.registerAdapter(new InstagramAdapter());
    this.registerAdapter(new LinkedInAdapter());
    this.registerAdapter(new GitHubAdapter());
  }

  registerAdapter(adapter: ISocialAdapter): void {
    this.adapters.set(adapter.platform, adapter);
  }

  getAdapter(platform: SocialPlatform): ISocialAdapter {
    const adapter = this.adapters.get(platform.toLowerCase() as SocialPlatform);
    if (!adapter) {
      throw new Error(`Platform adapter not found for platform: ${platform}`);
    }
    return adapter;
  }

  getSupportedPlatforms(): PlatformAdapterConfig[] {
    return Array.from(this.adapters.values()).map((adapter) => adapter.getConfig());
  }

  getAuthUrl(platform: SocialPlatform, redirectUri: string, state?: string): string {
    const adapter = this.getAdapter(platform);
    return adapter.getAuthUrl({ redirectUri, state });
  }

  hasAdapter(platform: string): boolean {
    return this.adapters.has(platform.toLowerCase() as SocialPlatform);
  }
}

export const platformService = new PlatformService();
