"use client";

import { useCallback } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";
import { useCachedCollection } from "@/lib/useCachedCollection";

export function useSuppliers() {
  const loadSuppliers = useCallback(async () => {
    return apiRequest("/suppliers");
  }, []);

  const { data, error, isLoading, isRefreshing, refresh } = useCachedCollection({
    cacheKey: "suppliers",
    fetcher: loadSuppliers,
    normalize: (next) => (Array.isArray(next) ? next : []),
    initialData: [],
    staleTimeMs: 20_000,
    subscribe: subscribeToBackendDataChanged,
  });

  const addSupplier = useCallback(async (newSupplier) => {
    await apiRequest("/suppliers", {
      method: "POST",
      body: JSON.stringify(newSupplier),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "create",
      title: "Supplier added",
      description: `${newSupplier.name} was added to suppliers.`,
    });
  }, [refresh]);

  const updateSupplier = useCallback(async (updatedSupplier, supplierId = updatedSupplier.supplierId || updatedSupplier.id) => {
    await apiRequest(`/suppliers/${encodeURIComponent(String(supplierId))}`, {
      method: "PUT",
      body: JSON.stringify(updatedSupplier),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Supplier updated",
      description: `${updatedSupplier.name} supplier details were updated.`,
    });
  }, [refresh]);

  const deleteSupplier = useCallback(async (supplierId) => {
    await apiRequest(`/suppliers/${encodeURIComponent(String(supplierId))}`, {
      method: "DELETE",
    });
    await refresh({ force: true });
    notifyBackendDataChanged();

    recordActivity({
      type: "delete",
      title: "Supplier removed",
      description: `Supplier ${supplierId} was removed from suppliers.`,
    });
  }, [refresh]);

  const resetSuppliers = useCallback(async () => {
    await apiRequest("/suppliers/reset", {
      method: "POST",
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Suppliers reset",
      description: "Supplier list was reset to defaults.",
    });
  }, [refresh]);

  return { suppliers: data, addSupplier, updateSupplier, deleteSupplier, resetSuppliers, error, isLoading, isRefreshing, reload: refresh };
}
