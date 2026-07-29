import { PluginManifest, PluginSandboxAPI } from '../../types/plugin';
import { PermissionService } from './permission.service';
import { db } from '../../lib/db';

export class PluginSandbox {
  private manifest: PluginManifest;
  private pluginStorageKey: string;

  constructor(manifest: PluginManifest) {
    this.manifest = manifest;
    this.pluginStorageKey = `plugin_storage_${manifest.id}`;
  }

  private assertPermission(permission: any, apiName: string) {
    if (!PermissionService.verifyPermission(this.manifest.permissions, permission)) {
      throw new Error(
        `[Plugin Security Guard] Access denied: Plugin "${this.manifest.name}" (${this.manifest.id}) requested ${apiName} API without "permission: ${permission}".`
      );
    }
  }

  public createSandboxAPI(): PluginSandboxAPI {
    return {
      storage: {
        get: async (key: string) => {
          this.assertPermission('read_storage', 'storage.get');
          try {
            const raw = localStorage.getItem(`${this.pluginStorageKey}_${key}`);
            return raw ? JSON.parse(raw) : null;
          } catch (e) {
            return null;
          }
        },
        set: async (key: string, value: any) => {
          this.assertPermission('write_storage', 'storage.set');
          localStorage.setItem(`${this.pluginStorageKey}_${key}`, JSON.stringify(value));
        },
      },
      logger: {
        info: (msg: string) => {
          console.log(`[Plugin:${this.manifest.name}:INFO]`, msg);
        },
        warn: (msg: string) => {
          console.warn(`[Plugin:${this.manifest.name}:WARN]`, msg);
        },
        error: (msg: string) => {
          console.error(`[Plugin:${this.manifest.name}:ERROR]`, msg);
        },
      },
      settings: {
        getSettings: async () => {
          this.assertPermission('manage_settings', 'settings.getSettings');
          return await db.getSettings();
        },
      },
      content: {
        getPosts: async () => {
          this.assertPermission('read_storage', 'content.getPosts');
          return await db.getAllPosts();
        },
      },
      workflow: {
        getWorkflows: async () => {
          this.assertPermission('access_workflow', 'workflow.getWorkflows');
          return await db.workflows.toArray();
        },
      },
      publishing: {
        getChannels: async () => {
          this.assertPermission('access_publishing', 'publishing.getChannels');
          return await db.getAllChannels();
        },
      },
      analytics: {
        getLogs: async () => {
          this.assertPermission('read_analytics', 'analytics.getLogs');
          return await db.getAllLogs();
        },
      },
      notification: {
        notify: (title: string, message: string) => {
          this.assertPermission('send_notification', 'notification.notify');
          console.log(`[Plugin Notification: ${title}]`, message);
        },
      },
    };
  }
}
