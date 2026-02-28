"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";
import { readStorageJson } from "@/lib/safeStorage";

const initialSuppliers = [
    { id: 1, name: "Farm Fresh Suppliers", contactPerson: "Khaalid Hashi", phone: "+252 61 213 7065", email: "khaalid@farmfresh.com", location: "Mogadishu, Somalia", products: "Apples, Bananas, Grapes", rating: 4.8, orders: 45, color: "bg-green-500" },
    { id: 2, name: "Tropical Imports Ltd", contactPerson: "Mohamed Abdiaziz", phone: "+252 61 090 9070", email: "Azhari@tropicalimports.com", location: "Doha, Qatar", products: "Mangoes, Pineapples, Avocados", rating: 4.9, orders: 38, color: "bg-blue-500" },
    { id: 3, name: "Berry Best Co.", contactPerson: "Khadiijo Hashi", phone: "+252 61 040 6889", email: "khadiijo@berrybest.com", location: "Dubai, UAE", products: "Strawberries, Blueberries", rating: 4.9, orders: 38, color: "bg-purple-500" },
];

export function useSuppliers() {
    const [suppliers, setSuppliers] = useState(initialSuppliers);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const parsed = readStorageJson("fruit_store_suppliers", null);
        if (Array.isArray(parsed)) setSuppliers(parsed);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem("fruit_store_suppliers", JSON.stringify(suppliers));
    }, [suppliers, isLoaded]);

    const addSupplier = useCallback((newSupplier) => {
        setSuppliers((prev) => [
            {
                ...newSupplier,
                id: prev.length + 1,
                rating: 5.0,
                orders: 0,
                color: "bg-orange-500",
            },
            ...prev,
        ]);
        recordActivity({
            type: "create",
            title: "Supplier added",
            description: `${newSupplier.name} was added to suppliers.`,
        });
    }, []);

    return { suppliers, addSupplier };
}
