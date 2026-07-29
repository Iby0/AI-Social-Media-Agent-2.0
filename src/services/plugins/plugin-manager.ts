import { PluginManifest, PluginLogRecord, PluginValidationResult } from '../../types/plugin';
import { PluginRegistry } from './plugin-registry';
import { PluginValidator } from './plugin-validator';
import { PluginLoader } from './plugin-loader';

export class PluginManager {
  static getPlugins(): PluginManifest[] {
    return PluginRegistry.getAllPlugins();
  }

  static getPlugin(id: string): PluginManifest | undefined {
    return PluginRegistry.getPluginById(id);
  }

  static async installPlugin(id: string): Promise<PluginManifest> {
    const plugin = PluginRegistry.getPluginById(id);
    if (!plugin) throw new Error(`Plugin ${id} not found.`);

    const now = new Date().toISOString();
    const updated: PluginManifest = {
      ...plugin,
      state: 'Installed',
      installedDate: plugin.installedDate || now,
      updatedDate: now,
    };

    PluginRegistry.savePlugin(updated);
    PluginRegistry.addLog(plugin.id, plugin.name, 'install', `Installed local plugin "${plugin.name}" v${plugin.version}.`);
    return updated;
  }

  static async enablePlugin(id: string): Promise<PluginManifest> {
    const plugin = PluginRegistry.getPluginById(id);
    if (!plugin) throw new Error(`Plugin ${id} not found.`);

    // Validation check
    const validation = PluginValidator.validateManifest(plugin);
    if (!validation.isValid) {
      const updatedErr: PluginManifest = {
        ...plugin,
        state: 'Error',
        enabled: false,
        lastError: validation.errors.join('; '),
      };
      PluginRegistry.savePlugin(updatedErr);
      PluginRegistry.addLog(
        plugin.id,
        plugin.name,
        'error',
        `Failed to enable plugin due to validation errors: ${validation.errors.join('; ')}`
      );
      throw new Error(`Cannot enable plugin: ${validation.errors.join('; ')}`);
    }

    const updated: PluginManifest = {
      ...plugin,
      state: 'Enabled',
      enabled: true,
      lastError: undefined,
      updatedDate: new Date().toISOString(),
    };

    try {
      await PluginLoader.loadPlugin(updated);
      PluginRegistry.savePlugin(updated);
      PluginRegistry.addLog(plugin.id, plugin.name, 'enable', `Enabled plugin "${plugin.name}" v${plugin.version}.`);
      return updated;
    } catch (err: any) {
      const errPlugin: PluginManifest = {
        ...plugin,
        state: 'Error',
        enabled: false,
        lastError: err.message || 'Failed to initialize sandbox',
      };
      PluginRegistry.savePlugin(errPlugin);
      PluginRegistry.addLog(
        plugin.id,
        plugin.name,
        'error',
        `Error loading plugin "${plugin.name}": ${err.message}`
      );
      throw err;
    }
  }

  static async disablePlugin(id: string): Promise<PluginManifest> {
    const plugin = PluginRegistry.getPluginById(id);
    if (!plugin) throw new Error(`Plugin ${id} not found.`);

    PluginLoader.unloadPlugin(id);

    const updated: PluginManifest = {
      ...plugin,
      state: 'Disabled',
      enabled: false,
      updatedDate: new Date().toISOString(),
    };

    PluginRegistry.savePlugin(updated);
    PluginRegistry.addLog(plugin.id, plugin.name, 'disable', `Disabled plugin "${plugin.name}".`);
    return updated;
  }

  static async updatePlugin(id: string, newVersion: string): Promise<PluginManifest> {
    const plugin = PluginRegistry.getPluginById(id);
    if (!plugin) throw new Error(`Plugin ${id} not found.`);

    const now = new Date().toISOString();
    const updated: PluginManifest = {
      ...plugin,
      version: newVersion,
      state: 'Updated',
      updatedDate: now,
    };

    PluginRegistry.savePlugin(updated);
    PluginRegistry.addLog(plugin.id, plugin.name, 'update', `Updated plugin "${plugin.name}" to version v${newVersion}.`);
    return updated;
  }

  static async removePlugin(id: string): Promise<void> {
    const plugin = PluginRegistry.getPluginById(id);
    if (!plugin) return;

    PluginLoader.unloadPlugin(id);

    // Instead of deleting, reset to Detected state or remove from stored registry
    const resetPlugin: PluginManifest = {
      ...plugin,
      enabled: false,
      state: 'Detected',
      installedDate: '',
      updatedDate: new Date().toISOString(),
      lastError: undefined,
    };

    PluginRegistry.savePlugin(resetPlugin);
    PluginRegistry.addLog(plugin.id, plugin.name, 'remove', `Removed/uninstalled plugin "${plugin.name}".`);
  }

  static async reloadPlugin(id: string): Promise<PluginManifest> {
    const plugin = PluginRegistry.getPluginById(id);
    if (!plugin) throw new Error(`Plugin ${id} not found.`);

    PluginLoader.unloadPlugin(id);
    if (plugin.enabled) {
      await PluginLoader.loadPlugin(plugin);
    }

    PluginRegistry.addLog(plugin.id, plugin.name, 'reload', `Reloaded sandbox instance for plugin "${plugin.name}".`);
    return plugin;
  }

  static registerLocalManifest(jsonPayload: string): { plugin: PluginManifest; validation: PluginValidationResult } {
    let parsed: Partial<PluginManifest>;
    try {
      parsed = JSON.parse(jsonPayload);
    } catch {
      throw new Error('Invalid JSON manifest string.');
    }

    const validation = PluginValidator.validateManifest(parsed);
    if (!validation.isValid || !validation.manifest) {
      throw new Error(`Manifest validation failed: ${validation.errors.join('; ')}`);
    }

    const manifest = validation.manifest;
    manifest.state = 'Detected';
    manifest.installedDate = '';
    manifest.updatedDate = new Date().toISOString();

    PluginRegistry.savePlugin(manifest);
    PluginRegistry.addLog(manifest.id, manifest.name, 'install', `Registered local manifest file for "${manifest.name}".`);

    return { plugin: manifest, validation };
  }

  static getLogs(): PluginLogRecord[] {
    return PluginRegistry.getLogs();
  }

  static clearLogs(): void {
    PluginRegistry.clearLogs();
  }
}
