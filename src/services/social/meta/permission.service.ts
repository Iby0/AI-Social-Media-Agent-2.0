export interface PermissionDetail {
  scope: string;
  name: string;
  description: string;
  category: 'facebook' | 'instagram' | 'general';
  isRequired: boolean;
}

export const META_PERMISSIONS: Record<string, PermissionDetail> = {
  pages_show_list: {
    scope: 'pages_show_list',
    name: 'Show Facebook Pages List',
    description: 'Allows reading the list of Facebook Pages managed or owned by the authenticated user.',
    category: 'facebook',
    isRequired: true,
  },
  pages_read_engagement: {
    scope: 'pages_read_engagement',
    name: 'Read Page Engagement',
    description: 'Allows reading page metrics, comments, reactions, and engagement statistics.',
    category: 'facebook',
    isRequired: true,
  },
  pages_manage_posts: {
    scope: 'pages_manage_posts',
    name: 'Manage Page Posts',
    description: 'Grants authority to create, edit, and publish content and posts to Facebook Pages.',
    category: 'facebook',
    isRequired: true,
  },
  public_profile: {
    scope: 'public_profile',
    name: 'Public Profile Access',
    description: 'Basic access to user name, profile photo, and public identity fields.',
    category: 'general',
    isRequired: true,
  },
  instagram_basic: {
    scope: 'instagram_basic',
    name: 'Instagram Basic Access',
    description: 'Allows reading Instagram Business account profile info, handle, follower count, and media items.',
    category: 'instagram',
    isRequired: true,
  },
  instagram_content_publish: {
    scope: 'instagram_content_publish',
    name: 'Instagram Content Publishing',
    description: 'Enables publishing photos, videos, single images, and reels directly to Instagram Business profiles.',
    category: 'instagram',
    isRequired: true,
  },
  instagram_manage_comments: {
    scope: 'instagram_manage_comments',
    name: 'Manage Instagram Comments',
    description: 'Allows reading, moderating, and replying to comments on published Instagram posts.',
    category: 'instagram',
    isRequired: false,
  },
};

export interface PermissionCheckResult {
  hasAllRequired: boolean;
  grantedPermissions: PermissionDetail[];
  missingPermissions: PermissionDetail[];
  permissionErrors: string[];
}

export class MetaPermissionService {
  /**
   * Evaluates granted vs required scopes
   */
  static evaluatePermissions(
    grantedScopes: string[],
    requiredScopes: string[]
  ): PermissionCheckResult {
    const grantedList: PermissionDetail[] = [];
    const missingList: PermissionDetail[] = [];
    const errors: string[] = [];

    const grantedSet = new Set(grantedScopes);

    requiredScopes.forEach((scope) => {
      const detail = META_PERMISSIONS[scope] || {
        scope,
        name: scope,
        description: 'Standard Meta platform API OAuth scope permission.',
        category: scope.startsWith('instagram') ? 'instagram' : 'facebook',
        isRequired: true,
      };

      if (grantedSet.has(scope)) {
        grantedList.push(detail);
      } else {
        missingList.push(detail);
        if (detail.isRequired) {
          errors.push(`Missing required scope: ${detail.name} (${scope})`);
        }
      }
    });

    return {
      hasAllRequired: missingList.filter((m) => m.isRequired).length === 0,
      grantedPermissions: grantedList,
      missingPermissions: missingList,
      permissionErrors: errors,
    };
  }

  static getPermissionDetail(scope: string): PermissionDetail {
    return (
      META_PERMISSIONS[scope] || {
        scope,
        name: scope,
        description: 'Standard Meta platform permission scope.',
        category: scope.startsWith('instagram') ? 'instagram' : 'facebook',
        isRequired: false,
      }
    );
  }
}
