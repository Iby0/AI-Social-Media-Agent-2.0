import React, { createContext, useContext } from 'react';
import { usePWA } from '../hooks/usePWA';
import { useOffline } from '../hooks/useOffline';
import { useEnvironment } from '../hooks/useEnvironment';
import { EnvironmentConfig } from '../services/system/environment.service';

interface SystemContextType {
  isOffline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  updateAvailable: boolean;
  triggerInstall: () => Promise<void>;
  applyUpdate: () => void;
  environment: EnvironmentConfig;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOffline } = useOffline();
  const { isInstallable, isInstalled, updateAvailable, triggerInstall, applyUpdate } = usePWA();
  const environment = useEnvironment();

  return (
    <SystemContext.Provider
      value={{
        isOffline,
        isInstallable,
        isInstalled,
        updateAvailable,
        triggerInstall,
        applyUpdate,
        environment,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystemContext = (): SystemContextType => {
  const ctx = useContext(SystemContext);
  if (!ctx) {
    throw new Error('useSystemContext must be used within a SystemProvider');
  }
  return ctx;
};
