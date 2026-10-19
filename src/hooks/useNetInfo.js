import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Custom hook to monitor device network and internet connectivity state.
 */
export const useNetInfo = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  // Manual refresh / retry check
  const checkConnectivity = useCallback(async () => {
    setIsChecking(true);
    try {
      const state = await NetInfo.fetch();
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(online);
      return online;
    } catch {
      setIsConnected(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on component mount
    checkConnectivity();

    // Subscribe to network state transitions
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(online);
    });

    return () => {
      unsubscribe();
    };
  }, [checkConnectivity]);

  return { isConnected, isChecking, checkConnectivity, setIsConnected };
};

export default useNetInfo;