import { PluginPermission } from '../../types/plugin';

export class PermissionService {
  private static PERMISSION_DESCRIPTIONS: Record<PluginPermission, { label: string; description: string }> = {
    read_storage: {
      label: 'Read Storage',
      description: 'Allows reading stored configuration and data snapshots.',
    },
    write_storage: {
      label: 'Write Storage',
      description: 'Allows modifying or persisting plugin-specific state data.',
    },
    access_ai: {
      label: 'Access AI Engine',
      description: 'Allows invoking local or configured LLM generation functions.',
    },
    access_publishing: {
      label: 'Access Social Publishing',
      description: 'Allows reading connected social channels and post status.',
    },
    access_workflow: {
      label: 'Access Automation Workflows',
      description: 'Allows inspecting and triggering automated posting workflows.',
    },
    read_analytics: {
      label: 'Read Performance Analytics',
      description: 'Allows reading activity logs, engagement rates, and stats.',
    },
    manage_settings: {
      label: 'Manage App Settings',
      description: 'Allows reading non-sensitive application settings.',
    },
    send_notification: {
      label: 'Send System Notifications',
      description: 'Allows generating system toast and dashboard alerts.',
    },
  };

  static getPermissionMeta(permission: PluginPermission) {
    return (
      this.PERMISSION_DESCRIPTIONS[permission] || {
        label: permission,
        description: 'Custom plugin capability requirement.',
      }
    );
  }

  static verifyPermission(
    grantedPermissions: PluginPermission[],
    requiredPermission: PluginPermission
  ): boolean {
    return grantedPermissions.includes(requiredPermission);
  }
}
