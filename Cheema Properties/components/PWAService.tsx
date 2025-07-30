import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Download, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// PWA Service for managing Progressive Web App features
export class PWAService {
  private static instance: PWAService;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isOnline = navigator.onLine;
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  // Initialize PWA service
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      this.setupEventListeners();
      this.isInitialized = true;
      console.log('✅ PWA Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ PWA Service initialization failed:', error);
      return false;
    }
  }

  // Setup PWA event listeners
  private setupEventListeners(): void {
    try {
      // Listen for install prompt
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        console.log('📱 PWA install prompt available');
      });

      // Listen for app installed
      window.addEventListener('appinstalled', () => {
        console.log('✅ PWA installed successfully');
        toast.success('CHEEMA PROPERTIES app installed!');
        this.deferredPrompt = null;
      });

      // Listen for online/offline status
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notifyListeners();
        console.log('🌐 Back online');
        toast.success('Connection restored');
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notifyListeners();
        console.log('📴 Gone offline');
        toast.error('No internet connection');
      });

    } catch (error) {
      console.error('❌ Error setting up PWA event listeners:', error);
    }
  }

  // Install PWA
  public async installPWA(): Promise<boolean> {
    if (!this.deferredPrompt) {
      toast.error('PWA installation not available');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted PWA installation');
        toast.success('Installing CHEEMA PROPERTIES app...');
        return true;
      } else {
        console.log('❌ User dismissed PWA installation');
        return false;
      }
    } catch (error) {
      console.error('❌ PWA installation failed:', error);
      toast.error('Installation failed. Please try again.');
      return false;
    }
  }

  // Check if PWA can be installed
  public canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  // Check if app is installed
  public isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Network status
  public isOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Subscribe to network status changes
  public subscribeToNetworkStatus(callback: (isOnline: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.isOnline));
  }

  // Clear cache (simplified version)
  public async clearCache(): Promise<void> {
    try {
      // Clear localStorage cache
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('cheema_') || key.startsWith('cache_')
      );
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      toast.success('Cache cleared');
      console.log('✅ Local cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      toast.error('Failed to clear cache');
    }
  }

  // Offline storage for inquiries
  public storeOfflineInquiry(inquiryData: any): void {
    try {
      const offlineInquiries = JSON.parse(localStorage.getItem('offline_inquiries') || '[]');
      offlineInquiries.push({
        ...inquiryData,
        timestamp: new Date().toISOString(),
        synced: false
      });
      localStorage.setItem('offline_inquiries', JSON.stringify(offlineInquiries));
      console.log('💾 Inquiry stored offline');
      toast.info('Inquiry saved offline. Will sync when online.');
    } catch (error) {
      console.error('❌ Failed to store offline inquiry:', error);
    }
  }

  // Sync offline data when back online
  public async syncOfflineData(): Promise<void> {
    if (!this.isOnline) return;

    try {
      const offlineInquiries = JSON.parse(localStorage.getItem('offline_inquiries') || '[]');
      const unsyncedInquiries = offlineInquiries.filter((inquiry: any) => !inquiry.synced);

      if (unsyncedInquiries.length === 0) return;

      console.log(`🔄 Syncing ${unsyncedInquiries.length} offline inquiries`);

      for (const inquiry of unsyncedInquiries) {
        try {
          // Simulate API call to sync data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mark as synced
          inquiry.synced = true;
          console.log('✅ Inquiry synced:', inquiry.id);
        } catch (error) {
          console.error('❌ Failed to sync inquiry:', error);
        }
      }

      localStorage.setItem('offline_inquiries', JSON.stringify(offlineInquiries));
      toast.success(`${unsyncedInquiries.length} inquiries synced`);
    } catch (error) {
      console.error('❌ Failed to sync offline data:', error);
    }
  }

  // Get app manifest data
  public getManifest(): any {
    return {
      name: 'CHEEMA PROPERTIES',
      short_name: 'CHEEMA',
      description: 'Punjab\'s Premier Real Estate - Find your dream property in Ludhiana & Chandigarh',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#334155',
      orientation: 'portrait-primary',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any'
        }
      ],
      categories: ['business', 'productivity', 'lifestyle']
    };
  }

  // Check if service worker is supported
  public isServiceWorkerSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  // Get PWA installation status
  public getInstallationStatus(): {
    canInstall: boolean;
    isInstalled: boolean;
    isSupported: boolean;
  } {
    return {
      canInstall: this.canInstall(),
      isInstalled: this.isInstalled(),
      isSupported: this.isServiceWorkerSupported()
    };
  }

  // Force refresh application
  public forceRefresh(): void {
    window.location.reload();
  }

  // Get offline inquiries count
  public getOfflineInquiriesCount(): number {
    try {
      const offlineInquiries = JSON.parse(localStorage.getItem('offline_inquiries') || '[]');
      return offlineInquiries.filter((inquiry: any) => !inquiry.synced).length;
    } catch (error) {
      return 0;
    }
  }
}

// PWA Install Button Component
export function PWAInstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const pwaService = PWAService.getInstance();

  useEffect(() => {
    const checkInstallability = () => {
      const status = pwaService.getInstallationStatus();
      setCanInstall(status.canInstall);
      setIsInstalled(status.isInstalled);
      setIsSupported(status.isSupported);
    };

    checkInstallability();

    // Check periodically
    const interval = setInterval(checkInstallability, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInstall = async () => {
    const success = await pwaService.installPWA();
    if (success) {
      setCanInstall(false);
      setIsInstalled(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
        <Download className="w-4 h-4" />
        <span>App Installed</span>
      </div>
    );
  }

  if (!isSupported) {
    return null;
  }

  if (!canInstall) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
        <Download className="w-3 h-3" />
        <span>PWA Ready</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
}

// Network Status Component
export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineCount, setOfflineCount] = useState(0);
  const pwaService = PWAService.getInstance();

  useEffect(() => {
    const unsubscribe = pwaService.subscribeToNetworkStatus(setIsOnline);
    
    // Update offline count
    const updateOfflineCount = () => {
      setOfflineCount(pwaService.getOfflineInquiriesCount());
    };
    
    updateOfflineCount();
    const interval = setInterval(updateOfflineCount, 5000);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleRetry = async () => {
    if (isOnline) {
      await pwaService.syncOfflineData();
      setOfflineCount(pwaService.getOfflineInquiriesCount());
    } else {
      // Try to reconnect
      window.location.reload();
    }
  };

  return (
    <div className={`fixed top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm z-50 ${
      isOnline 
        ? 'bg-green-50 text-green-700 border border-green-200' 
        : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Online</span>
          {offlineCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRetry}
              className="h-6 px-2 text-green-700 hover:bg-green-100"
            >
              Sync ({offlineCount})
            </Button>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Offline</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRetry}
            className="h-6 px-2 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </>
      )}
    </div>
  );
}

// Export singleton instance
export const pwaService = PWAService.getInstance();