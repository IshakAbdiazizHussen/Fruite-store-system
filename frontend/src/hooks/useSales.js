"use client";

import { useState, useCallback, useEffect } from "react";
import { chartData as initialChartData } from "@/app/data/page";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";

const initialSalesList = [
  { saleId: "SALE001", name: "Apples", units: 120, total: 420.0, date: "2024-11-20" },
  { saleId: "SALE002", name: "Bananas", units: 85, total: 187.0, date: "2024-11-19" },
  { saleId: "SALE003", name: "Strawberries", units: 30, total: 255.0, date: "2024-11-19" },
  { saleId: "SALE004", name: "Oranges", units: 150, total: 480.0, date: "2024-11-18" },
];

export function useSales() {
  const [sales, setSales] = useState(initialSalesList);
  const [analytics, setAnalytics] = useState(initialChartData);

  const loadSales = useCallback(async () => {
    const data = await apiRequest("/sales");
    setSales(Array.isArray(data?.sales) ? data.sales : []);
    setAnalytics(Array.isArray(data?.analytics) ? data.analytics : []);
  }, []);

  useEffect(() => {
    loadSales().catch((error) => {
      console.error("Failed to load sales", error);
    });
  }, [loadSales]);

  const addSale = useCallback(async (newSale) => {
    await apiRequest("/sales", {
      method: "POST",
      body: JSON.stringify(newSale),
    });
    await loadSales();
    recordActivity({
      type: "create",
      title: "Sale recorded",
      description: `A sale was recorded for ${newSale.name}.`,
    });
  }, [loadSales]);

  return { sales, analytics, addSale };
}
