import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BackupMetadata,
  BackupPayload,
  BackupSettingsConfig,
  BackupType,
} from '../types/backup';
import { BackupService } from '../services/backup/backup.service';
import { RestoreService, RestoreSummary } from '../services/backup/restore.service';
import { ExportService } from '../services/backup/export.service';
import { ImportService } from '../services/backup/import.service';

interface BackupContextType {
  history: BackupMetadata[];
  settings: BackupSettingsConfig;
  isProcessing: boolean;
  lastActionSummary: string | null;
  refreshHistory: () => void;
  createBackup: (type?: BackupType, customName?: string) => Promise<BackupPayload>;
  restoreBackup: (payload: BackupPayload, selectiveType?: BackupType) => Promise<RestoreSummary>;
  exportBackupJson: (payload: BackupPayload) => void;
  exportBackupCsv: (payload: BackupPayload) => void;
  importBackupFile: (file: File) => Promise<{ payload?: BackupPayload; errors: string[] }>;
  updateSettings: (newSettings: Partial<BackupSettingsConfig>) => void;
  clearHistory: () => void;
}

const BackupContext = createContext<BackupContextType | undefined>(undefined);

export const BackupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<BackupMetadata[]>(() => BackupService.getBackupHistory());
  const [settings, setSettings] = useState<BackupSettingsConfig>(() => BackupService.getBackupSettings());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastActionSummary, setLastActionSummary] = useState<string | null>(null);

  const refreshHistory = useCallback(() => {
    setHistory(BackupService.getBackupHistory());
  }, []);

  const createBackup = useCallback(async (type: BackupType = 'full', customName?: string) => {
    setIsProcessing(true);
    try {
      const payload = await BackupService.createBackup(type, customName);
      setHistory(BackupService.getBackupHistory());
      setLastActionSummary(`Backup created: ${payload.metadata.name}`);
      return payload;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const restoreBackup = useCallback(async (payload: BackupPayload, selectiveType?: BackupType) => {
    setIsProcessing(true);
    try {
      const summary = await RestoreService.restoreFromPayload(payload, selectiveType);
      setLastActionSummary(
        `Restore completed successfully! Items restored: ${summary.postsRestored} posts, ${summary.channelsRestored} channels.`
      );
      setHistory(BackupService.getBackupHistory());
      return summary;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportBackupJson = useCallback((payload: BackupPayload) => {
    ExportService.downloadJson(payload);
  }, []);

  const exportBackupCsv = useCallback((payload: BackupPayload) => {
    ExportService.downloadCsv(payload);
  }, []);

  const importBackupFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      if (file.name.endsWith('.csv')) {
        const payload = await ImportService.parseCsvFile(file);
        return { payload, errors: [] };
      } else {
        const res = await ImportService.parseAndValidateJsonFile(file);
        return { payload: res.payload, errors: res.validation.errors };
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<BackupSettingsConfig>) => {
    const updated = BackupService.updateBackupSettings(newSettings);
    setSettings(updated);
  }, []);

  const clearHistory = useCallback(() => {
    BackupService.clearBackupHistory();
    setHistory([]);
  }, []);

  return (
    <BackupContext.Provider
      value={{
        history,
        settings,
        isProcessing,
        lastActionSummary,
        refreshHistory,
        createBackup,
        restoreBackup,
        exportBackupJson,
        exportBackupCsv,
        importBackupFile,
        updateSettings,
        clearHistory,
      }}
    >
      {children}
    </BackupContext.Provider>
  );
};

export const useBackupContext = () => {
  const context = useContext(BackupContext);
  if (!context) {
    throw new Error('useBackupContext must be used within a BackupProvider');
  }
  return context;
};
