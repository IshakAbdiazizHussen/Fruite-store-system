"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const loadSuppliers = useCallback(async () => {
    const data = await apiRequest("/suppliers");
    setSuppliers(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    loadSuppliers().catch((error) => {
      console.error("Failed to load suppliers", error);
    });
    return subscribeToBackendDataChanged(() => {
      loadSuppliers().catch(() => {});
    });
  }, [loadSuppliers]);

  const addSupplier = useCallback(async (newSupplier) => {
    await apiRequest("/suppliers", {
      method: "POST",
      body: JSON.stringify(newSupplier),
    });
    await loadSuppliers();
    notifyBackendDataChanged();
    recordActivity({
      type: "create",
      title: "Supplier added",
      description: `${newSupplier.name} was added to suppliers.`,
    });
  }, [loadSuppliers]);

  const updateSupplier = useCallback(async (updatedSupplier, supplierId = updatedSupplier.supplierId || updatedSupplier.id) => {
    await apiRequest(`/suppliers/${encodeURIComponent(String(supplierId))}`, {
      method: "PUT",
      body: JSON.stringify(updatedSupplier),
    });
    await loadSuppliers();
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Supplier updated",
      description: `${updatedSupplier.name} supplier details were updated.`,
    });
  }, [loadSuppliers]);

  const deleteSupplier = useCallback(async (supplierId) => {
    await apiRequest(`/suppliers/${encodeURIComponent(String(supplierId))}`, {
      method: "DELETE",
    });
    await loadSuppliers();
    notifyBackendDataChanged();

    recordActivity({
      type: "delete",
      title: "Supplier removed",
      description: `Supplier ${supplierId} was removed from suppliers.`,
    });
  }, [loadSuppliers]);

  const resetSuppliers = useCallback(async () => {
    await apiRequest("/suppliers/reset", {
      method: "POST",
    });
    await loadSuppliers();
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Suppliers reset",
      description: "Supplier list was reset to defaults.",
    });
  }, [loadSuppliers]);

  return { suppliers, addSupplier, updateSupplier, deleteSupplier, resetSuppliers };
}
