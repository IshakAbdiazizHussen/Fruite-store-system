"use client";

import { useState, useCallback, useEffect } from "react";
import { orders as initialOrders } from "@/app/data/page";
import { recordActivity } from "@/lib/activityLog";
import { readStorageJson } from "@/lib/safeStorage";

export function useOrders() {
    const [orders, setOrders] = useState(initialOrders);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const parsed = readStorageJson("fruit_store_orders", null);
        if (Array.isArray(parsed)) setOrders(parsed);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem("fruit_store_orders", JSON.stringify(orders));
    }, [orders, isLoaded]);

    const addOrder = useCallback((newOrder) => {
        setOrders((prevOrders) => [
            {
                ...newOrder,
                orderId: `ORD${String(prevOrders.length + 1).padStart(3, "0")}`,
            },
            ...prevOrders,
        ]);
        recordActivity({
            type: "create",
            title: "Order created",
            description: `New order added for ${newOrder.customer}.`,
        });
    }, []);

    const deleteOrder = useCallback((orderId) => {
        setOrders((prevOrders) => prevOrders.filter((o) => o.orderId !== orderId));
        recordActivity({
            type: "delete",
            title: "Order deleted",
            description: `${orderId} was deleted.`,
        });
    }, []);

    const updateOrderStatus = useCallback((orderId, status) => {
        setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)));
        recordActivity({
            type: "update",
            title: "Order status updated",
            description: `${orderId} changed to ${status}.`,
        });
    }, []);

    const updateOrder = useCallback((updatedOrder) => {
        setOrders((prev) =>
            prev.map((o) => (o.orderId === updatedOrder.orderId ? updatedOrder : o))
        );
        recordActivity({
            type: "update",
            title: "Order updated",
            description: `${updatedOrder.orderId} was edited.`,
        });
    }, []);

    return { orders, addOrder, deleteOrder, updateOrderStatus, updateOrder };
}
