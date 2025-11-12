'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserDevice, UserSubscription, MarketplaceDevice, DataPoint } from '@/lib/types';
import { mockStore } from '@/lib/mockData';

interface AppContextType {
  userDevices: UserDevice[];
  userSubscriptions: UserSubscription[];
  marketplaceDevices: MarketplaceDevice[];
  liveDataPoints: DataPoint[];
  addUserDevice: (device: UserDevice) => void;
  updateUserDevice: (deviceId: string, updates: Partial<UserDevice>) => void;
  deleteUserDevice: (deviceId: string) => void;
  addUserSubscription: (subscription: UserSubscription) => void;
  updateUserSubscription: (subscriptionId: string, updates: Partial<UserSubscription>) => void;
  cancelUserSubscription: (subscriptionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userDevices, setUserDevices] = useState<UserDevice[]>(mockStore.userDevices);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>(mockStore.userSubscriptions);
  const [marketplaceDevices] = useState<MarketplaceDevice[]>(mockStore.marketplaceDevices);
  const [liveDataPoints] = useState<DataPoint[]>(mockStore.liveDataPoints);

  const addUserDevice = (device: UserDevice) => {
    setUserDevices(prev => [...prev, device]);
  };

  const updateUserDevice = (deviceId: string, updates: Partial<UserDevice>) => {
    setUserDevices(prev => 
      prev.map(device => device.id === deviceId ? { ...device, ...updates } : device)
    );
  };

  const deleteUserDevice = (deviceId: string) => {
    setUserDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  const addUserSubscription = (subscription: UserSubscription) => {
    setUserSubscriptions(prev => [...prev, subscription]);
  };

  const updateUserSubscription = (subscriptionId: string, updates: Partial<UserSubscription>) => {
    setUserSubscriptions(prev =>
      prev.map(sub => sub.id === subscriptionId ? { ...sub, ...updates } : sub)
    );
  };

  const cancelUserSubscription = (subscriptionId: string) => {
    setUserSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
  };

  return (
    <AppContext.Provider
      value={{
        userDevices,
        userSubscriptions,
        marketplaceDevices,
        liveDataPoints,
        addUserDevice,
        updateUserDevice,
        deleteUserDevice,
        addUserSubscription,
        updateUserSubscription,
        cancelUserSubscription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}