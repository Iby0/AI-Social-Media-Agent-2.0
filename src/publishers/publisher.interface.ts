import {
  PublishRequest,
  PublishResponse,
  PlatformValidationResult,
  PlatformLimitConfig,
} from './publisher.types';

export interface IPublisherAdapter {
  platform: string;
  getLimits(): PlatformLimitConfig;
  validateRequest(request: PublishRequest): PlatformValidationResult;
  publish(request: PublishRequest): Promise<PublishResponse>;
}
