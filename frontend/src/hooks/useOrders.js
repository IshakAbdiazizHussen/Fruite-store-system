"use client";

import { useCallback } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";
import { useCachedCollection } from "@/lib/useCachedCollection";

export function useOrders() {
  const loadOrders = useCallback(async () => {
    return apiRequest("/orders");
  }, []);

  const { data, error, isLoading, isRefreshing, refresh } = useCachedCollection({
    cacheKey: "orders",
    fetcher: loadOrders,
    normalize: (next) => (Array.isArray(next) ? next : []),
    initialData: [],
    staleTimeMs: 20_000,
    subscribe: subscribeToBackendDataChanged,
  });

  const addOrder = useCallback(async (newOrder) => {
    await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(newOrder),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "create",
      title: "Order created",
      description: `New order added for ${newOrder.customer}.`,
    });
  }, [refresh]);

  const deleteOrder = useCallback(async (orderId) => {
    await apiRequest(`/orders/${encodeURIComponent(orderId)}`, {
      method: "DELETE",
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "delete",
      title: "Order deleted",
      description: `${orderId} was deleted.`,
    });
  }, [refresh]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const target = data.find((order) => order.orderId === orderId);
    if (!target) return;

    await apiRequest(`/orders/${encodeURIComponent(orderId)}`, {
      method: "PUT",
      body: JSON.stringify({ ...target, status }),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Order status updated",
      description: `${orderId} changed to ${status}.`,
    });
  }, [data, refresh]);

  const updateOrder = useCallback(async (updatedOrder) => {
    await apiRequest(`/orders/${encodeURIComponent(updatedOrder.orderId)}`, {
      method: "PUT",
      body: JSON.stringify(updatedOrder),
    });
    await refresh({ force: true });
    notifyBackendDataChanged();
    recordActivity({
      type: "update",
      title: "Order updated",
      description: `${updatedOrder.orderId} was edited.`,
    });
  }, [refresh]);

  return { orders: data, addOrder, deleteOrder, updateOrderStatus, updateOrder, error, isLoading, isRefreshing, reload: refresh };
}
