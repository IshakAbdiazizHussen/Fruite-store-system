"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";

export function useInventory() {
  const [items, setItems] = useState([]);

  const loadItems = useCallback(async () => {
    const data = await apiRequest("/inventory");
    setItems(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    loadItems().catch((error) => {
      console.error("Failed to load inventory", error);
    });
    return subscribeToBackendDataChanged(() => {
      loadItems().catch(() => {});
    });
  }, [loadItems]);

  const addItem = useCallback(async (newItem) => {
    await apiRequest("/inventory", {
      method: "POST",
      body: JSON.stringify(newItem),
    });
    await loadItems();
    notifyBackendDataChanged();
    recordActivity({
      type: "create",
      title: "Inventory item added",
      description: `${newItem.name} was added to inventory.`,
    });
  }, [loadItems]);

  const deleteItem = useCallback(async (name) => {
    await apiRequest(`/inventory/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });
    await loadItems();
    notifyBackendDataChanged();
    recordActivity({
      type: "delete",
      title: "Inventory item deleted",
      description: `${name} was removed from inventory.`,
    });
  }, [loadItems]);

  const updateItem = useCallback(async (updatedItem, originalName = updatedItem.name) => {
    await apiRequest(`/inventory/${encodeURIComponent(originalName)}`, {
      method: "PUT",
      body: JSON.stringify(updatedItem),
    });
    await loadItems();
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Inventory item updated",
      description: `${updatedItem.name} was updated.`,
    });
  }, [loadItems]);

  return { items, addItem, deleteItem, updateItem };
}
