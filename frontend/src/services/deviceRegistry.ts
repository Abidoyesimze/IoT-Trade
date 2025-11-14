/**
 * Device Registry Service
 * 
 * Handles loading and discovering devices from the Somnia blockchain
 */

import type { Address } from 'viem';
import { readDeviceMetadata } from './deviceService';
import type { UserDevice, MarketplaceDevice } from '@/lib/types';
import { DeviceStatus } from '@/lib/enums';

/**
 * Load user's devices from blockchain
 * 
 * Note: Since Somnia Data Streams doesn't have a built-in registry,
 * we need to track device addresses. For now, we'll use localStorage
 * or later implement a device registry contract.
 * 
 * @param ownerAddress - The wallet address of the device owner
 * @param deviceAddresses - Array of device addresses to load metadata for
 */
export async function loadUserDevices(
  ownerAddress: Address,
  deviceAddresses: Address[]
): Promise<UserDevice[]> {
  const devices: UserDevice[] = [];

  for (const deviceAddress of deviceAddresses) {
    try {
      const metadata = await readDeviceMetadata(ownerAddress, deviceAddress);
      
      if (metadata) {
        // Create device object from metadata
        const device: UserDevice = {
          id: `device-${deviceAddress.slice(2, 10)}`,
          name: metadata.deviceName,
          type: metadata.deviceType,
          status: DeviceStatus.ONLINE, // Could check latest data timestamp to determine status
          qualityScore: 0, // Would need to calculate from data quality
          location: metadata.location,
          totalDataPoints: 0, // Would need to track from events
          totalEarnings: 0, // Would need to track from payments
          totalEarningsUsd: 0,
          activeSubscribers: 0, // Would need to track subscriptions
          deviceAddress: deviceAddress,
          ownerAddress: metadata.ownerAddress,
          pricePerDataPoint: metadata.pricePerDataPoint,
          updateFrequency: 'Unknown', // Not stored in metadata
          uptime: 0, // Would need to calculate
          lastPublished: new Date(), // Could check latest data timestamp
        };

        devices.push(device);
      }
    } catch (error) {
      console.error(`Error loading device ${deviceAddress}:`, error);
      // Continue loading other devices
    }
  }

  return devices;
}

/**
 * Get device addresses for a user from localStorage
 * (In production, this would come from a registry contract or database)
 */
export function getUserDeviceAddresses(ownerAddress: Address): Address[] {
  if (typeof window === 'undefined') return [];
  
  const key = `user_devices_${ownerAddress.toLowerCase()}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      return JSON.parse(stored) as Address[];
    } catch (error) {
      console.error('Error parsing stored device addresses:', error);
      return [];
    }
  }
  
  return [];
}

/**
 * Save device address for a user to localStorage
 */
export function saveUserDeviceAddress(ownerAddress: Address, deviceAddress: Address): void {
  if (typeof window === 'undefined') return;
  
  const key = `user_devices_${ownerAddress.toLowerCase()}`;
  const addresses = getUserDeviceAddresses(ownerAddress);
  
  if (!addresses.includes(deviceAddress)) {
    addresses.push(deviceAddress);
    localStorage.setItem(key, JSON.stringify(addresses));
  }
}

/**
 * Discover marketplace devices
 * 
 * Implementation uses:
 * 1. Local discovery list (shared across users via localStorage)
 * 2. On-chain metadata lookup for each device
 * 3. Falls back to empty array if no devices found
 * 
 * In production, you could enhance this with:
 * - An on-chain registry contract
 * - Event querying/indexing
 * - The Graph or similar indexing service
 */
export async function discoverMarketplaceDevices(
  limit: number = 50
): Promise<MarketplaceDevice[]> {
  try {
    // Get discoverable devices from shared list
    const { getDiscoverableDevices } = await import('./registryService');
    const discoverableDevices = getDiscoverableDevices();
    
    if (discoverableDevices.length === 0) {
      return [];
    }
    
    // Load metadata for each discoverable device
    const devices: MarketplaceDevice[] = [];
    
    for (const { deviceAddress, ownerAddress } of discoverableDevices.slice(0, limit)) {
      try {
        const device = await loadMarketplaceDevice(ownerAddress, deviceAddress);
        if (device) {
          devices.push(device);
        }
      } catch (error) {
        console.error(`Error loading device ${deviceAddress}:`, error);
        // Continue loading other devices
      }
    }
    
    return devices;
  } catch (error) {
    console.error('Error discovering marketplace devices:', error);
    return [];
  }
}

/**
 * Load marketplace device by address
 */
export async function loadMarketplaceDevice(
  ownerAddress: Address,
  deviceAddress: Address
): Promise<MarketplaceDevice | null> {
  try {
    const metadata = await readDeviceMetadata(ownerAddress, deviceAddress);
    
    if (!metadata) {
      return null;
    }

    return {
      id: `device-${deviceAddress.slice(2, 10)}`,
      name: metadata.deviceName,
      type: metadata.deviceType,
      status: DeviceStatus.ONLINE,
      qualityScore: 0, // Would need to calculate
      location: metadata.location,
      pricePerDataPoint: metadata.pricePerDataPoint,
      subscribers: 0, // Would need to track
      owner: metadata.ownerAddress,
      updateFrequency: 'Unknown',
      uptime: 0,
    };
  } catch (error) {
    console.error('Error loading marketplace device:', error);
    return null;
  }
}

