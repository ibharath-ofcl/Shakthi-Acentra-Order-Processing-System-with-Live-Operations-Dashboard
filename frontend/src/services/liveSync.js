import { useState, useEffect, useCallback, useRef } from 'react';
import { operationsApi, ordersApi, inventoryApi, healthApi } from './api';

/**
 * Custom React Hook for live operational telemetry polling & real-time synchronization.
 * Supports auto-refresh, manual trigger, pause/resume, and last-updated tracking.
 */
export function useLiveTelemetry(pollIntervalMs = 2000) {
  const [statistics, setStatistics] = useState(null);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dlqItems, setDlqItems] = useState([]);
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [statsRes, eventsRes, ordersRes, invRes, dlqRes, healthRes] = await Promise.allSettled([
        operationsApi.getStatistics(),
        operationsApi.getRecentEvents(50),
        ordersApi.getAllOrders(0, 30),
        inventoryApi.getAllInventory(),
        operationsApi.getDlqMessages(0, 30),
        healthApi.getSystemHealth(),
      ]);

      if (!isMountedRef.current) return;

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStatistics(statsRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data) {
        setEvents(eventsRes.value.data);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data?.content) {
        setOrders(ordersRes.value.data.content);
      }
      if (invRes.status === 'fulfilled' && invRes.value?.data) {
        setInventory(invRes.value.data);
      }
      if (dlqRes.status === 'fulfilled' && dlqRes.value?.data?.content) {
        setDlqItems(dlqRes.value.data.content);
      }
      if (healthRes.status === 'fulfilled' && healthRes.value?.data) {
        setHealth(healthRes.value.data);
      }

      setLastSyncTime(new Date());
      setError(null);
    } catch (err) {
      if (isMountedRef.current) {
        console.error('Failed to sync live operational data:', err);
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Polling loop
  useEffect(() => {
    isMountedRef.current = true;
    fetchAllData();

    if (!isLive) return;

    const intervalId = setInterval(() => {
      fetchAllData();
    }, pollIntervalMs);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchAllData, isLive, pollIntervalMs]);

  const toggleLive = useCallback(() => {
    setIsLive((prev) => !prev);
  }, []);

  return {
    statistics,
    events,
    orders,
    inventory,
    dlqItems,
    health,
    isLoading,
    isLive,
    lastSyncTime,
    error,
    refreshNow: fetchAllData,
    toggleLive,
  };
}
