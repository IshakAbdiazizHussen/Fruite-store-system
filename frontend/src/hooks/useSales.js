"use client";

import { useCallback } from "react";
import { chartData as initialChartData } from "@/lib/mockData";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";
import { useCachedCollection } from "@/lib/useCachedCollection";

export function useSales() {
  const loadSales = useCallback(async () => {
    return apiRequest("/sales");
  }, []);

  const { data, error, isLoading, isRefreshing, refresh } = useCachedCollection({
    cacheKey: "sales",
    fetcher: loadSales,
    normalize: (next) => ({
      sales: Array.isArray(next?.sales) ? next.sales : [],
      analytics: Array.isArray(next?.analytics) ? next.analytics : initialChartData,
    }),
    initialData: {
      sales: [],
      analytics: initialChartData,
    },
    staleTimeMs: 20_000,
    subscribe: subscribeToBackendDataChanged,
  });

  const addSale = useCallback(async (newSale) => {
    await apiRequest("/sales", {
      method: "POST",
      body: JSON.stringify(newSale),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "create",
      title: "Sale recorded",
      description: `A sale was recorded for ${newSale.name}.`,
    });
  }, [refresh]);

  return { sales: data.sales, analytics: data.analytics, addSale, error, isLoading, isRefreshing, reload: refresh };
}
