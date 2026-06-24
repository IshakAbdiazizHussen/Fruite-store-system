"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchCachedResource,
  getCachedResourceState,
  primeCachedResource,
  subscribeCachedResource,
} from "@/lib/resourceCache";

export function useCachedCollection({
  cacheKey,
  fetcher,
  normalize = (value) => value,
  initialData,
  staleTimeMs = 30_000,
  persist = "none",
  subscribe,
}) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const syncFromCache = useCallback(() => {
    const entry = getCachedResourceState(cacheKey, { persist });
    if (entry.data !== undefined) {
      setData(normalize(entry.data));
      setIsLoading(false);
    }
    setError(entry.error || "");
    return entry;
  }, [cacheKey, normalize, persist]);

  const refresh = useCallback(async ({ force = false } = {}) => {
    const entry = syncFromCache();
    const hasCachedData = entry.data !== undefined;

    setIsLoading(!hasCachedData);
    setIsRefreshing(hasCachedData);

    try {
      const nextData = await fetchCachedResource(cacheKey, fetcher, {
        force,
        persist,
        staleTimeMs,
      });
      setData(normalize(nextData));
      setError("");
      return nextData;
    } catch (refreshError) {
      setError(refreshError.message || "Failed to refresh data.");
      throw refreshError;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [cacheKey, fetcher, normalize, persist, staleTimeMs, syncFromCache]);

  const updateCachedData = useCallback((nextData) => {
    primeCachedResource(cacheKey, nextData, { persist });
    setData(normalize(nextData));
    setError("");
    setIsLoading(false);
    setIsRefreshing(false);
    return nextData;
  }, [cacheKey, normalize, persist]);

  useEffect(() => {
    syncFromCache();

    const unsubscribeCache = subscribeCachedResource(cacheKey, () => {
      syncFromCache();
    });

    const unsubscribeExternal = typeof subscribe === "function"
      ? subscribe(() => {
          refresh({ force: true }).catch(() => {});
        })
      : () => {};

    refresh().catch(() => {});

    return () => {
      unsubscribeCache();
      unsubscribeExternal();
    };
  }, [cacheKey, refresh, subscribe, syncFromCache]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    refresh,
    updateCachedData,
  };
}
