import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { scheduleService } from '../services/scheduleService';
import { mediaService } from '../services/mediaService';
import { settingService } from '../services/settingService';
import { logService } from '../services/logService';
import { socialAccountService } from '../services/socialAccountService';
import { DatabaseBackupPayload } from '../types';

export async function exportDatabaseJSON(): Promise<string> {
  const [users, posts, schedules, media, settings, logs, socialAccounts] = await Promise.all([
    userService.getAll(),
    postService.getAll(),
    scheduleService.getAll(),
    mediaService.getAll(),
    settingService.getSettings(),
    logService.getAll(),
    socialAccountService.getAll(),
  ]);

  const payload: DatabaseBackupPayload = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    users,
    posts,
    schedules,
    media,
    settings: [settings],
    logs,
    socialAccounts,
  };

  return JSON.stringify(payload, null, 2);
}

export async function importDatabaseJSON(jsonStr: string): Promise<{ success: boolean; importedCounts: Record<string, number> }> {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error('Invalid JSON format for backup restoration.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Malformed backup object.');
  }

  const counts = {
    users: 0,
    posts: 0,
    schedules: 0,
    media: 0,
    logs: 0,
    socialAccounts: 0,
  };

  // Import Users
  if (Array.isArray(parsed.users)) {
    for (const u of parsed.users) {
      if (u.id && u.name && u.email) {
        await userService.create(u);
        counts.users++;
      }
    }
  }

  // Import Posts
  if (Array.isArray(parsed.posts)) {
    for (const p of parsed.posts) {
      if (p.id && p.title) {
        await postService.save(p);
        counts.posts++;
      }
    }
  }

  // Import Schedules
  if (Array.isArray(parsed.schedules)) {
    for (const s of parsed.schedules) {
      if (s.id && s.postId) {
        await scheduleService.save(s);
        counts.schedules++;
      }
    }
  }

  // Import Media
  if (Array.isArray(parsed.media)) {
    for (const m of parsed.media) {
      if (m.id && m.fileName) {
        await mediaService.save(m);
        counts.media++;
      }
    }
  }

  // Import Settings
  if (Array.isArray(parsed.settings) && parsed.settings.length > 0) {
    await settingService.saveSettings(parsed.settings[0]);
  } else if (parsed.settings && typeof parsed.settings === 'object') {
    await settingService.saveSettings(parsed.settings);
  }

  // Import Social Accounts
  if (Array.isArray(parsed.socialAccounts)) {
    for (const sa of parsed.socialAccounts) {
      if (sa.id && sa.platform) {
        await socialAccountService.save(sa);
        counts.socialAccounts++;
      }
    }
  }

  await logService.log(`Database backup imported successfully (${JSON.stringify(counts)})`, 'backup', 'success');

  return { success: true, importedCounts: counts };
}
