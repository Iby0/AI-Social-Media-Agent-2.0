import { PluginManifest, PluginSandboxAPI } from '../../types/plugin';
import { PluginSandbox } from './sandbox';
import { PluginValidator } from './plugin-validator';

export interface LoadedPluginInstance {
  manifest: PluginManifest;
  sandbox: PluginSandboxAPI;
  init: () => void;
  destroy: () => void;
}

export class PluginLoader {
  private static activeInstances: Map<string, LoadedPluginInstance> = new Map();

  static async loadPlugin(manifest: PluginManifest): Promise<LoadedPluginInstance> {
    const validation = PluginValidator.validateManifest(manifest);
    if (!validation.isValid) {
      throw new Error(`Plugin validation failed: ${validation.errors.join('; ')}`);
    }

    if (!manifest.enabled) {
      throw new Error(`Cannot load disabled plugin "${manifest.name}".`);
    }

    const sandbox = new PluginSandbox(manifest);
    const api = sandbox.createSandboxAPI();

    const instance: LoadedPluginInstance = {
      manifest,
      sandbox: api,
      init: () => {
        api.logger.info(`[Plugin Instance Loaded] ${manifest.name} v${manifest.version} running in secure sandbox.`);
      },
      destroy: () => {
        api.logger.info(`[Plugin Instance Unloaded] ${manifest.name} deactivated cleanly.`);
      },
    };

    try {
      instance.init();
      this.activeInstances.set(manifest.id, instance);
      return instance;
    } catch (err: any) {
      api.logger.error(`Plugin initialization threw runtime error: ${err.message || err}`);
      throw err;
    }
  }

  static unloadPlugin(pluginId: string): void {
    const instance = this.activeInstances.get(pluginId);
    if (instance) {
      try {
        instance.destroy();
      } catch (err) {
        console.error(`Error deactivating plugin ${pluginId}:`, err);
      } finally {
        this.activeInstances.delete(pluginId);
      }
    }
  }

  static getActiveInstance(pluginId: string): LoadedPluginInstance | undefined {
    return this.activeInstances.get(pluginId);
  }

  static getActiveInstances(): LoadedPluginInstance[] {
    return Array.from(this.activeInstances.values());
  }
}
