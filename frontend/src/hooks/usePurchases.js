"use client";

import { useCallback } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";
import { useCachedCollection } from "@/lib/useCachedCollection";

export function usePurchases() {
  const loadPurchases = useCallback(async () => {
    return apiRequest("/purchases");
  }, []);

  const { data, error, isLoading, isRefreshing, refresh } = useCachedCollection({
    cacheKey: "purchases",
    fetcher: loadPurchases,
    normalize: (next) => (Array.isArray(next) ? next : []),
    initialData: [],
    staleTimeMs: 20_000,
    subscribe: subscribeToBackendDataChanged,
  });

  const addPurchase = useCallback(async (newPurchase) => {
    await apiRequest("/purchases", {
      method: "POST",
      body: JSON.stringify(newPurchase),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();

    recordActivity({
      type: "create",
      title: "Purchase added",
      description: `New purchase was created for ${newPurchase.supplier}.`,
    });
  }, [refresh]);

  const updatePurchaseStatus = useCallback(async (purchaseId, status) => {
    const target = data.find((purchase) => purchase.purchaseId === purchaseId);
    if (!target) return;

    await apiRequest(`/purchases/${encodeURIComponent(purchaseId)}`, {
      method: "PUT",
      body: JSON.stringify({ ...target, status }),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Purchase status updated",
      description: `${purchaseId} changed to ${status}.`,
    });
  }, [data, refresh]);

  const updatePurchase = useCallback(async (updatedPurchase) => {
    await apiRequest(`/purchases/${encodeURIComponent(updatedPurchase.purchaseId)}`, {
      method: "PUT",
      body: JSON.stringify(updatedPurchase),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Purchase updated",
      description: `${updatedPurchase.purchaseId} was edited.`,
    });
  }, [refresh]);

  return { purchases: data, addPurchase, updatePurchaseStatus, updatePurchase, error, isLoading, isRefreshing, reload: refresh };
}
