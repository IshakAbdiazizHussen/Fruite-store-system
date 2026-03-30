"use client";

import { useState, useCallback, useEffect } from "react";
import { orders as initialOrders } from "@/app/data/page";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";

export function useOrders() {
  const [orders, setOrders] = useState(initialOrders);

  const loadOrders = useCallback(async () => {
    const data = await apiRequest("/orders");
    setOrders(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    loadOrders().catch((error) => {
      console.error("Failed to load orders", error);
    });
  }, [loadOrders]);

  const addOrder = useCallback(async (newOrder) => {
    await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(newOrder),
    });
    await loadOrders();
    recordActivity({
      type: "create",
      title: "Order created",
      description: `New order added for ${newOrder.customer}.`,
    });
  }, [loadOrders]);

  const deleteOrder = useCallback(async (orderId) => {
    await apiRequest(`/orders/${encodeURIComponent(orderId)}`, {
      method: "DELETE",
    });
    await loadOrders();
    recordActivity({
      type: "delete",
      title: "Order deleted",
      description: `${orderId} was deleted.`,
    });
  }, [loadOrders]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const target = orders.find((order) => order.orderId === orderId);
    if (!target) return;

    await apiRequest(`/orders/${encodeURIComponent(orderId)}`, {
      method: "PUT",
      body: JSON.stringify({ ...target, status }),
    });
    await loadOrders();
    recordActivity({
      type: "update",
      title: "Order status updated",
      description: `${orderId} changed to ${status}.`,
    });
  }, [loadOrders, orders]);

  const updateOrder = useCallback(async (updatedOrder) => {
    await apiRequest(`/orders/${encodeURIComponent(updatedOrder.orderId)}`, {
      method: "PUT",
      body: JSON.stringify(updatedOrder),
    });
    await loadOrders();
    recordActivity({
      type: "update",
      title: "Order updated",
      description: `${updatedOrder.orderId} was edited.`,
    });
  }, [loadOrders]);

  return { orders, addOrder, deleteOrder, updateOrderStatus, updateOrder };
}
