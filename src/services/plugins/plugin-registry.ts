import { PluginManifest, PluginLogRecord } from '../../types/plugin';
import { LOCAL_PRESET_PLUGINS } from '../../plugins/examples/available-plugins';

const STORAGE_KEY_PLUGINS = 'ai_social_plugins_metadata';
const STORAGE_KEY_LOGS = 'ai_social_plugins_audit_logs';

export class PluginRegistry {
  private static getStoredPlugins(): PluginManifest[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PLUGINS);
      if (!raw) {
        // Initialize with local preset plugins
        localStorage.setItem(STORAGE_KEY_PLUGINS, JSON.stringify(LOCAL_PRESET_PLUGINS));
        return LOCAL_PRESET_PLUGINS;
      }
      const parsed: PluginManifest[] = JSON.parse(raw);
      // Ensure any missing preset plugin is present in detected state
      const existingIds = new Set(parsed.map((p) => p.id));
      let updated = false;

      for (const preset of LOCAL_PRESET_PLUGINS) {
        if (!existingIds.has(preset.id)) {
          parsed.push(preset);
          updated = true;
        }
      }

      if (updated) {
        localStorage.setItem(STORAGE_KEY_PLUGINS, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return LOCAL_PRESET_PLUGINS;
    }
  }

  private static saveStoredPlugins(plugins: PluginManifest[]): void {
    localStorage.setItem(STORAGE_KEY_PLUGINS, JSON.stringify(plugins));
  }

  static getAllPlugins(): PluginManifest[] {
    return this.getStoredPlugins();
  }

  static getPluginById(id: string): PluginManifest | undefined {
    return this.getStoredPlugins().find((p) => p.id === id);
  }

  static savePlugin(plugin: PluginManifest): void {
    const plugins = this.getStoredPlugins();
    const index = plugins.findIndex((p) => p.id === plugin.id);
    if (index >= 0) {
      plugins[index] = plugin;
    } else {
      plugins.push(plugin);
    }
    this.saveStoredPlugins(plugins);
  }

  static removePlugin(id: string): void {
    let plugins = this.getStoredPlugins();
    plugins = plugins.filter((p) => p.id !== id);
    this.saveStoredPlugins(plugins);
  }

  // Logs
  static getLogs(): PluginLogRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LOGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static addLog(
    pluginId: string,
    pluginName: string,
    action: PluginLogRecord['action'],
    message: string,
    details?: Record<string, any>
  ): PluginLogRecord {
    const logs = this.getLogs();
    const record: PluginLogRecord = {
      id: 'plog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      pluginId,
      pluginName,
      action,
      timestamp: new Date().toISOString(),
      message,
      details,
    };
    logs.unshift(record);
    // Keep max 200 logs
    if (logs.length > 200) logs.length = 200;
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    return record;
  }

  static clearLogs(): void {
    localStorage.removeItem(STORAGE_KEY_LOGS);
  }
}
