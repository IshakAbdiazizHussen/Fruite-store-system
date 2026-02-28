"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";
import { readStorageJson } from "@/lib/safeStorage";

const initialItems = [
    { name: "Red Apples", category: "Apples", stock: 450, unit: "kg", price: 3.5, expiry: "2025-12-20", status: "In Stock" },
    { name: "Bananas", category: "Tropical", stock: 320, unit: "kg", price: 2.2, expiry: "2025-12-18", status: "In Stock" },
    { name: "Strawberries", category: "Berries", stock: 25, unit: "kg", price: 8.5, expiry: "2025-12-15", status: "Low Stock" },
    { name: "Oranges", category: "Citrus", stock: 380, unit: "kg", price: 3.2, expiry: "2025-12-22", status: "In Stock" },
    { name: "Avocados", category: "Tropical", stock: 15, unit: "kg", price: 6.8, expiry: "2025-12-14", status: "Low Stock" },
    { name: "Blueberries", category: "Berries", stock: 18, unit: "kg", price: 9.0, expiry: "2025-12-19", status: "In Stock" },
    { name: "Mangose", category: "Tropical", stock: 50, unit: "kg", price: 7.5, expiry: "2025-12-21", status: "In Stock" },
    { name: "Grapes", category: "Berries", stock: 60, unit: "kg", price: 4.5, expiry: "2025-12-17", status: "In Stock" },
    { name: "Pineapples", category: "Tropical", stock: 22, unit: "kg", price: 5.0, expiry: "2025-12-16", status: "Low Stock" },
    { name: "Raspberries", category: "Berries", stock: 30, unit: "kg", price: 10.0, expiry: "2025-12-23", status: "In Stock" },
    { name: "Lemons", category: "Citrus", stock: 200, unit: "kg", price: 2.8, expiry: "2025-12-24", status: "In Stock" },
    { name: "Watermelons", category: "Melons", stock: 80, unit: "kg", price: 3.0, expiry: "2025-12-25", status: "In Stock" },
];

export function useInventory() {
    const [items, setItems] = useState(initialItems);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const parsed = readStorageJson("fruit_store_inventory", null);
        if (Array.isArray(parsed)) setItems(parsed);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem("fruit_store_inventory", JSON.stringify(items));
    }, [items, isLoaded]);

    const addItem = useCallback((newItem) => {
        setItems((prevItems) => [...prevItems, {
            ...newItem,
            status: newItem.stock < 50 ? "Low Stock" : "In Stock"
        }]);
        recordActivity({
            type: "create",
            title: "Inventory item added",
            description: `${newItem.name} was added to inventory.`,
        });
    }, []);

    const deleteItem = useCallback((name) => {
        setItems((prevItems) => prevItems.filter((item) => item.name !== name));
        recordActivity({
            type: "delete",
            title: "Inventory item deleted",
            description: `${name} was removed from inventory.`,
        });
    }, []);

    const updateItem = useCallback((updatedItem) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.name === updatedItem.name ? updatedItem : item))
        );
        recordActivity({
            type: "update",
            title: "Inventory item updated",
            description: `${updatedItem.name} was updated.`,
        });
    }, []);

    return { items, addItem, deleteItem, updateItem };
}
