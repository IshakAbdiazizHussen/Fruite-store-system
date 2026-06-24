"use client";

import { useCallback } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";
import { useCachedCollection } from "@/lib/useCachedCollection";

export function useInventory() {
  const loadItems = useCallback(async () => {
    return apiRequest("/inventory");
  }, []);

  const { data, error, isLoading, isRefreshing, refresh, updateCachedData } = useCachedCollection({
    cacheKey: "inventory",
    fetcher: loadItems,
    normalize: (next) => (Array.isArray(next) ? next : []),
    initialData: [],
    staleTimeMs: 20_000,
    subscribe: subscribeToBackendDataChanged,
  });

  const addItem = useCallback(async (newItem) => {
    await apiRequest("/inventory", {
      method: "POST",
      body: JSON.stringify(newItem),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "create",
      title: "Inventory item added",
      description: `${newItem.name} was added to inventory.`,
    });
  }, [refresh]);

  const deleteItem = useCallback(async (name) => {
    await apiRequest(`/inventory/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });
    updateCachedData(data.filter((item) => item.name !== name));
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "delete",
      title: "Inventory item deleted",
      description: `${name} was removed from inventory.`,
    });
  }, [data, refresh, updateCachedData]);

  const updateItem = useCallback(async (updatedItem, originalName = updatedItem.name) => {
    await apiRequest(`/inventory/${encodeURIComponent(originalName)}`, {
      method: "PUT",
      body: JSON.stringify(updatedItem),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Inventory item updated",
      description: `${updatedItem.name} was updated.`,
    });
  }, [refresh]);

  return { items: data, addItem, deleteItem, updateItem, error, isLoading, isRefreshing, reload: refresh };
}
