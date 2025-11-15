import { type Address, type Account, createPublicClient, http, type WalletClient } from 'viem';
import { deviceRegistryAbi } from '@/lib/abi/deviceRegistry';
import { somniaTestnet } from '@/config/wagmi';

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_DEVICE_REGISTRY_ADDRESS || '').toLowerCase() as Address;

function requireContractAddress() {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x') {
    throw new Error('DeviceRegistry address missing. Set NEXT_PUBLIC_DEVICE_REGISTRY_ADDRESS.');
  }
  return CONTRACT_ADDRESS;
}

function getWalletAccount(walletClient: WalletClient): Address {
  const account = walletClient.account as Account | undefined;
  if (!account) {
    throw new Error('Wallet client missing account');
  }
  if (typeof account === 'string') {
    return account as Address;
  }
  return account.address as Address;
}

const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(somniaTestnet.rpcUrls.default.http[0]),
});

type ContractDevice = {
  owner: Address;
  name: string;
  deviceType: string;
  location: string;
  pricePerDataPoint: bigint;
  subscriptionDuration: bigint;
  metadataURI: string;
  isActive: boolean;
  registeredAt: bigint;
};

export type RegistryDevice = {
  address: Address;
  owner: Address;
  name: string;
  deviceType: string;
  location: string;
  pricePerDataPoint: number;
  subscriptionDuration: number;
  metadataURI: string;
  isActive: boolean;
  registeredAt: number;
};

function toRegistryDevice(address: Address, raw: ContractDevice): RegistryDevice {
  return {
    address,
    owner: raw.owner,
    name: raw.name,
    deviceType: raw.deviceType,
    location: raw.location,
    pricePerDataPoint: Number(raw.pricePerDataPoint) / 1e18,
    subscriptionDuration: Number(raw.subscriptionDuration),
    metadataURI: raw.metadataURI,
    isActive: raw.isActive,
    registeredAt: Number(raw.registeredAt) * 1000,
  };
}

export async function fetchAllRegistryDevices(): Promise<RegistryDevice[]> {
  const contractAddress = requireContractAddress();
  const addresses = (await publicClient.readContract({
    address: contractAddress,
    abi: deviceRegistryAbi,
    functionName: 'getAllDevices',
  })) as Address[];

  const devices = await Promise.all(
    addresses.map(async (deviceAddress) => {
      const device = (await publicClient.readContract({
        address: contractAddress,
        abi: deviceRegistryAbi,
        functionName: 'getDevice',
        args: [deviceAddress],
      })) as ContractDevice;
      return toRegistryDevice(deviceAddress, device);
    }),
  );

  return devices;
}

export async function fetchDevicesByOwner(owner: Address): Promise<RegistryDevice[]> {
  const contractAddress = requireContractAddress();
  const addresses = (await publicClient.readContract({
    address: contractAddress,
    abi: deviceRegistryAbi,
    functionName: 'getDevicesByOwner',
    args: [owner],
  })) as Address[];

  const devices = await Promise.all(
    addresses.map(async (deviceAddress) => {
      const device = (await publicClient.readContract({
        address: contractAddress,
        abi: deviceRegistryAbi,
        functionName: 'getDevice',
        args: [deviceAddress],
      })) as ContractDevice;
      return toRegistryDevice(deviceAddress, device);
    }),
  );

  return devices;
}

export async function registerDeviceOnChain(
  walletClient: WalletClient,
  params: {
    deviceAddress: Address;
    name: string;
    deviceType: string;
    location: string;
    pricePerDataPoint: bigint;
    subscriptionDuration: bigint;
    metadataURI: string;
  },
): Promise<Address> {
  const contractAddress = requireContractAddress();
  return walletClient.writeContract({
    address: contractAddress,
    abi: deviceRegistryAbi,
    functionName: 'registerDevice',
    args: [
      params.deviceAddress,
      params.name,
      params.deviceType,
      params.location,
      params.pricePerDataPoint,
      params.subscriptionDuration,
      params.metadataURI,
    ],
    account: getWalletAccount(walletClient),
    chain: walletClient.chain,
  });
}

export async function updateDeviceOnChain(
  walletClient: WalletClient,
  params: {
    deviceAddress: Address;
    name: string;
    deviceType: string;
    location: string;
    pricePerDataPoint: bigint;
    subscriptionDuration: bigint;
    metadataURI: string;
  },
): Promise<Address> {
  const contractAddress = requireContractAddress();
  return walletClient.writeContract({
    address: contractAddress,
    abi: deviceRegistryAbi,
    functionName: 'updateDevice',
    args: [
      params.deviceAddress,
      params.name,
      params.deviceType,
      params.location,
      params.pricePerDataPoint,
      params.subscriptionDuration,
      params.metadataURI,
    ],
    account: getWalletAccount(walletClient),
    chain: walletClient.chain,
  });
}

export async function setDeviceActiveOnChain(
  walletClient: WalletClient,
  deviceAddress: Address,
  isActive: boolean,
): Promise<Address> {
  const contractAddress = requireContractAddress();
  return walletClient.writeContract({
    address: contractAddress,
    abi: deviceRegistryAbi,
    functionName: 'setDeviceActive',
    args: [deviceAddress, isActive],
    account: getWalletAccount(walletClient),
    chain: walletClient.chain,
  });
}

export async function purchaseDeviceAccess(
  walletClient: WalletClient,
  deviceAddress: Address,
  value: bigint,
): Promise<Address> {
  const contractAddress = requireContractAddress();
  return walletClient.writeContract({
    address: contractAddress,
    abi: deviceRegistryAbi,
    functionName: 'purchaseAccess',
    args: [deviceAddress],
    account: getWalletAccount(walletClient),
    chain: walletClient.chain,
    value,
  });
}

export async function getAccessExpiry(subscriber: Address, deviceAddress: Address): Promise<number> {
  const contractAddress = requireContractAddress();
  const expiry = (await publicClient.readContract({
    address: contractAddress,
    abi: deviceRegistryAbi,
    functionName: 'getAccessExpiry',
    args: [subscriber, deviceAddress],
  })) as bigint;
  return Number(expiry) * 1000;
}

export async function isDeviceRegistered(deviceAddress: Address): Promise<boolean> {
  const contractAddress = requireContractAddress();
  return (await publicClient.readContract({
    address: contractAddress,
    abi: deviceRegistryAbi,
    functionName: 'deviceExists',
    args: [deviceAddress],
  })) as boolean;
}
