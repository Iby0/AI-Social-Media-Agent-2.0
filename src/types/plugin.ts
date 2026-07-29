export type PluginCategory =
  | 'ai_provider'
  | 'image_provider'
  | 'social_platform'
  | 'workflow'
  | 'analytics'
  | 'export'
  | 'import'
  | 'backup'
  | 'storage'
  | 'theme'
  | 'notification'
  | 'webhook';

export type PluginLifecycleState =
  | 'Detected'
  | 'Installed'
  | 'Enabled'
  | 'Disabled'
  | 'Updated'
  | 'Removed'
  | 'Error';

export type PluginPermission =
  | 'read_storage'
  | 'write_storage'
  | 'access_ai'
  | 'access_publishing'
  | 'access_workflow'
  | 'read_analytics'
  | 'manage_settings'
  | 'send_notification';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: PluginCategory;
  entryFile: string;
  icon?: string;
  permissions: PluginPermission[];
  dependencies: string[];
  minAppVersion: string;
  maxAppVersion?: string;
  enabled: boolean;
  installedDate: string;
  updatedDate: string;
  checksum: string;
  state: PluginLifecycleState;
  lastError?: string;
}

export interface PluginLogRecord {
  id: string;
  pluginId: string;
  pluginName: string;
  action: 'install' | 'enable' | 'disable' | 'update' | 'remove' | 'error' | 'reload';
  timestamp: string;
  message: string;
  details?: Record<string, any>;
}

export interface PluginValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  manifest?: PluginManifest;
}

export interface PluginSandboxAPI {
  storage: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
  logger: {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
  };
  settings: {
    getSettings: () => Promise<any>;
  };
  content: {
    getPosts: () => Promise<any[]>;
  };
  workflow: {
    getWorkflows: () => Promise<any[]>;
  };
  publishing: {
    getChannels: () => Promise<any[]>;
  };
  analytics: {
    getLogs: () => Promise<any[]>;
  };
  notification: {
    notify: (title: string, message: string) => void;
  };
}
