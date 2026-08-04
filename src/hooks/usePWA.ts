import { useState, useEffect } from 'react';
import { PWAService } from '../services/system/pwa.service';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    PWAService.captureInstallPrompt();
    PWAService.registerServiceWorker();

    setIsInstalled(PWAService.isPWAInstalled());

    const handleInstallable = () => setIsInstallable(true);
    const handleUpdate = () => setUpdateAvailable(true);

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-update-available', handleUpdate);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-update-available', handleUpdate);
    };
  }, []);

  const triggerInstall = async () => {
    const installed = await PWAService.triggerInstall();
    if (installed) {
      setIsInstallable(false);
      setIsInstalled(true);
    }
  };

  const applyUpdate = () => {
    window.location.reload();
  };

  return {
    isInstallable,
    isInstalled,
    updateAvailable,
    triggerInstall,
    applyUpdate,
  };
};
