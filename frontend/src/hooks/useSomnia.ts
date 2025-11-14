/**
 * React Hook for Somnia Data Streams SDK
 * 
 * Provides convenient access to Somnia SDK operations using wagmi hooks
 */

import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { useMemo } from "react";
import { createSomniaSDKPublic, createSomniaSDKWithWallet, type SDK } from "@/lib/somnia";

/**
 * Hook to get Somnia SDK instance
 * Returns SDK instance for reading (public) and writing (wallet)
 */
export function useSomniaSDK() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const sdkPublic = useMemo(() => {
    if (publicClient) {
      return createSomniaSDKPublic();
    }
    return null;
  }, [publicClient]);

  const sdkWallet = useMemo(async () => {
    if (isConnected && walletClient) {
      return await createSomniaSDKWithWallet(walletClient);
    }
    return null;
  }, [isConnected, walletClient]);

  return {
    sdkPublic,
    sdkWallet,
    isConnected,
    address,
  };
}

/**
 * Hook to check if wallet is connected and ready
 */
export function useSomniaReady() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  return {
    isReady: isConnected && !!address && !!walletClient,
    address,
    walletClient,
  };
}

