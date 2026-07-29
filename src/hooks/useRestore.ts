import { useBackupContext } from '../context/BackupContext';

export function useRestore() {
  const ctx = useBackupContext();

  return {
    isProcessing: ctx.isProcessing,
    restoreBackup: ctx.restoreBackup,
    lastActionSummary: ctx.lastActionSummary,
  };
}
