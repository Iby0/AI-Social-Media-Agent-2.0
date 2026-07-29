import { useBackupContext } from '../context/BackupContext';

export function useBackup() {
  const ctx = useBackupContext();

  return {
    history: ctx.history,
    settings: ctx.settings,
    isProcessing: ctx.isProcessing,
    lastActionSummary: ctx.lastActionSummary,
    createBackup: ctx.createBackup,
    exportBackupJson: ctx.exportBackupJson,
    exportBackupCsv: ctx.exportBackupCsv,
    importBackupFile: ctx.importBackupFile,
    updateSettings: ctx.updateSettings,
    clearHistory: ctx.clearHistory,
    refreshHistory: ctx.refreshHistory,
  };
}
