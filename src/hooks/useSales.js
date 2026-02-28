"use client";

import { useState, useCallback, useEffect } from "react";
import { chartData as initialChartData } from "@/app/data/page";
import { recordActivity } from "@/lib/activityLog";
import { readStorageJson } from "@/lib/safeStorage";

const initialSalesList = [
    { id: "SALE001", fruit: "Apples", units: 120, total: 420.00, date: "2024-11-20" },
    { id: "SALE002", fruit: "Bananas", units: 85, total: 187.00, date: "2024-11-19" },
    { id: "SALE003", fruit: "Strawberries", units: 30, total: 255.00, date: "2024-11-19" },
    { id: "SALE004", fruit: "Oranges", units: 150, total: 480.00, date: "2024-11-18" },
];

export function useSales() {
    const [sales, setSales] = useState(initialSalesList);
    const [analytics, setAnalytics] = useState(initialChartData);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const parsedSales = readStorageJson("fruit_store_sales", null);
        const parsedAnalytics = readStorageJson("fruit_store_analytics", null);
        if (Array.isArray(parsedSales)) setSales(parsedSales);
        if (Array.isArray(parsedAnalytics)) setAnalytics(parsedAnalytics);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("fruit_store_sales", JSON.stringify(sales));
            localStorage.setItem("fruit_store_analytics", JSON.stringify(analytics));
        }
    }, [sales, analytics, isLoaded]);

    const addSale = useCallback((newSale) => {
        const saleId = `SALE${String(sales.length + 1).padStart(3, "0")}`;
        const entry = { ...newSale, id: saleId };
        setSales((prev) => [entry, ...prev]);
        recordActivity({
            type: "create",
            title: "Sale recorded",
            description: `${saleId} was recorded for ${newSale.name}.`,
        });

        // Update analytics (simplified)
        const month = new Date(newSale.date).toLocaleString('default', { month: 'short' });
        setAnalytics((prev) =>
            prev.map(item =>
                item.month === month
                    ? { ...item, revenue: item.revenue + newSale.total, units: item.units + newSale.units }
                    : item
            )
        );
    }, [sales.length]);

    return { sales, analytics, addSale };
}
