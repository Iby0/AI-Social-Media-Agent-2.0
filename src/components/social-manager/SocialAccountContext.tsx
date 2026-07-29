import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SocialAccountRecord, SocialPlatform, ConnectionHistoryItem } from '../../database/types';
import { accountManagerService, AccountQueryOptions } from '../../services/social-manager/account-manager.service';
import { connectionHistoryService } from '../../services/social-manager/connection-history.service';
import { tokenMonitorService } from '../../services/social-manager/token-monitor.service';

export interface OverviewStats {
  totalAccounts: number;
  activeAccounts: number;
  disconnectedAccounts: number;
  expiringTokens: number;
  connectionErrors: number;
}

export interface SocialAccountContextType {
  accounts: SocialAccountRecord[];
  stats: OverviewStats;
  connectionHistory: ConnectionHistoryItem[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  platformFilter: string;
  sortBy: AccountQueryOptions['sortBy'];
  selectedAccount: SocialAccountRecord | null;
  isDetailsOpen: boolean;
  isConnectModalOpen: boolean;
  selectedConnectPlatform: SocialPlatform | null;
  
  // Setters & Filter triggers
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setPlatformFilter: (platform: string) => void;
  setSortBy: (sort: AccountQueryOptions['sortBy']) => void;
  
  // Actions
  loadAccounts: () => Promise<void>;
  connectAccount: (platform: SocialPlatform, code?: string, redirectUri?: string) => Promise<void>;
  reconnectAccount: (id: string) => Promise<void>;
  disconnectAccount: (id: string) => Promise<void>;
  refreshToken: (id: string) => Promise<void>;
  refreshAllTokens: () => Promise<{ successCount: number; errorCount: number }>;
  renameDisplayName: (id: string, newDisplayName: string) => Promise<void>;
  toggleEnableAccount: (id: string, enabled: boolean) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  checkHealth: (id: string) => Promise<void>;
  
  // Modal & Drawer State Helpers
  openDetails: (account: SocialAccountRecord) => void;
  closeDetails: () => void;
  openConnectModal: (platform?: SocialPlatform) => void;
  closeConnectModal: () => void;
}

export const SocialAccountContext = createContext<SocialAccountContextType | undefined>(undefined);

export const SocialAccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<SocialAccountRecord[]>([]);
  const [connectionHistory, setConnectionHistory] = useState<ConnectionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<AccountQueryOptions['sortBy']>('Recently Connected');
  
  const [selectedAccount, setSelectedAccount] = useState<SocialAccountRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [selectedConnectPlatform, setSelectedConnectPlatform] = useState<SocialPlatform | null>(null);

  const [stats, setStats] = useState<OverviewStats>({
    totalAccounts: 0,
    activeAccounts: 0,
    disconnectedAccounts: 0,
    expiringTokens: 0,
    connectionErrors: 0,
  });

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetched = await accountManagerService.getAccounts({
        status: statusFilter,
        platform: platformFilter,
        searchQuery,
        sortBy,
      });
      setAccounts(fetched);

      // Compute Overview Stats
      const allAccounts = await accountManagerService.getAccounts({ status: 'All', platform: 'All' });
      let active = 0;
      let disconnected = 0;
      let expiring = 0;
      let errors = 0;

      for (const a of allAccounts) {
        if (a.status === 'Connected' && a.enabled !== false) active++;
        if (a.status === 'Disconnected') disconnected++;
        if (a.status === 'Error' || a.healthLevel === 'Critical') errors++;
        
        const tokenInfo = tokenMonitorService.evaluateToken(a);
        if (tokenInfo.isExpiringSoon || tokenInfo.isExpired) expiring++;
      }

      setStats({
        totalAccounts: allAccounts.length,
        activeAccounts: active,
        disconnectedAccounts: disconnected,
        expiringTokens: expiring,
        connectionErrors: errors,
      });

      const history = await connectionHistoryService.getHistory();
      setConnectionHistory(history);

      // Update selected account if open
      if (selectedAccount) {
        const updatedSelected = fetched.find((a) => a.id === selectedAccount.id);
        if (updatedSelected) setSelectedAccount(updatedSelected);
      }
    } catch (err) {
      console.error('Failed to load social accounts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, platformFilter, searchQuery, sortBy, selectedAccount]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const connectAccount = async (platform: SocialPlatform, code?: string, redirectUri?: string) => {
    setIsLoading(true);
    try {
      await accountManagerService.connectAccount(platform, code, redirectUri);
      await loadAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const reconnectAccount = async (id: string) => {
    setIsLoading(true);
    try {
      await accountManagerService.reconnectAccount(id);
      await loadAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectAccount = async (id: string) => {
    setIsLoading(true);
    try {
      await accountManagerService.disconnectAccount(id);
      await loadAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (id: string) => {
    setIsLoading(true);
    try {
      await accountManagerService.refreshToken(id);
      await loadAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllTokens = async () => {
    setIsLoading(true);
    try {
      const result = await accountManagerService.refreshAllTokens();
      await loadAccounts();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const renameDisplayName = async (id: string, newDisplayName: string) => {
    setIsLoading(true);
    try {
      await accountManagerService.renameDisplayName(id, newDisplayName);
      await loadAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEnableAccount = async (id: string, enabled: boolean) => {
    setIsLoading(true);
    try {
      await accountManagerService.toggleEnableAccount(id, enabled);
      await loadAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const removeAccount = async (id: string) => {
    setIsLoading(true);
    try {
      await accountManagerService.removeAccount(id);
      if (selectedAccount?.id === id) {
        setSelectedAccount(null);
        setIsDetailsOpen(false);
      }
      await loadAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const checkHealth = async (id: string) => {
    setIsLoading(true);
    try {
      await accountManagerService.checkAccountHealth(id);
      await loadAccounts();
    } finally {
      setIsLoading(false);
    }
  };

  const openDetails = (account: SocialAccountRecord) => {
    setSelectedAccount(account);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  const openConnectModal = (platform?: SocialPlatform) => {
    setSelectedConnectPlatform(platform || null);
    setIsConnectModalOpen(true);
  };

  const closeConnectModal = () => {
    setIsConnectModalOpen(false);
    setSelectedConnectPlatform(null);
  };

  return (
    <SocialAccountContext.Provider
      value={{
        accounts,
        stats,
        connectionHistory,
        isLoading,
        searchQuery,
        statusFilter,
        platformFilter,
        sortBy,
        selectedAccount,
        isDetailsOpen,
        isConnectModalOpen,
        selectedConnectPlatform,
        setSearchQuery,
        setStatusFilter,
        setPlatformFilter,
        setSortBy,
        loadAccounts,
        connectAccount,
        reconnectAccount,
        disconnectAccount,
        refreshToken,
        refreshAllTokens,
        renameDisplayName,
        toggleEnableAccount,
        removeAccount,
        checkHealth,
        openDetails,
        closeDetails,
        openConnectModal,
        closeConnectModal,
      }}
    >
      {children}
    </SocialAccountContext.Provider>
  );
};

export const useSocialAccounts = (): SocialAccountContextType => {
  const context = useContext(SocialAccountContext);
  if (!context) {
    throw new Error('useSocialAccounts must be used within a SocialAccountProvider');
  }
  return context;
};
