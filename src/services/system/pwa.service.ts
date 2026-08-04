export class PWAService {
  private static deferredPrompt: any = null;

  static registerServiceWorker(): void {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA Service Worker] Registered successfully:', reg.scope);
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      window.dispatchEvent(new CustomEvent('pwa-update-available'));
                    }
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.warn('[PWA Service Worker] Registration failed:', err);
          });
      });
    }
  }

  static captureInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      window.dispatchEvent(new CustomEvent('pwa-installable'));
    });
  }

  static async triggerInstall(): Promise<boolean> {
    if (!this.deferredPrompt) return false;
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    return outcome === 'accepted';
  }

  static isPWAInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }
}
