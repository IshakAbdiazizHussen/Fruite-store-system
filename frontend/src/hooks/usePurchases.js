"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";

export function usePurchases() {
  const [purchases, setPurchases] = useState([]);

  const loadPurchases = useCallback(async () => {
    const data = await apiRequest("/purchases");
    setPurchases(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    loadPurchases().catch((error) => {
      console.error("Failed to load purchases", error);
    });
    return subscribeToBackendDataChanged(() => {
      loadPurchases().catch(() => {});
    });
  }, [loadPurchases]);

  const addPurchase = useCallback(async (newPurchase) => {
    await apiRequest("/purchases", {
      method: "POST",
      body: JSON.stringify(newPurchase),
    });
    await loadPurchases();
    notifyBackendDataChanged();

    recordActivity({
      type: "create",
      title: "Purchase added",
      description: `New purchase was created for ${newPurchase.supplier}.`,
    });
  }, [loadPurchases]);

  const updatePurchaseStatus = useCallback(async (purchaseId, status) => {
    const target = purchases.find((purchase) => purchase.purchaseId === purchaseId);
    if (!target) return;

    await apiRequest(`/purchases/${encodeURIComponent(purchaseId)}`, {
      method: "PUT",
      body: JSON.stringify({ ...target, status }),
    });
    await loadPurchases();
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Purchase status updated",
      description: `${purchaseId} changed to ${status}.`,
    });
  }, [loadPurchases, purchases]);

  const updatePurchase = useCallback(async (updatedPurchase) => {
    await apiRequest(`/purchases/${encodeURIComponent(updatedPurchase.purchaseId)}`, {
      method: "PUT",
      body: JSON.stringify(updatedPurchase),
    });
    await loadPurchases();
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Purchase updated",
      description: `${updatedPurchase.purchaseId} was edited.`,
    });
  }, [loadPurchases]);

  return { purchases, addPurchase, updatePurchaseStatus, updatePurchase };
}
