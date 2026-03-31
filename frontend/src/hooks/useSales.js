"use client";

import { useState, useCallback, useEffect } from "react";
import { chartData as initialChartData } from "@/lib/mockData";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";
import { notifyBackendDataChanged, subscribeToBackendDataChanged } from "@/lib/backendSync";

export function useSales() {
  const [sales, setSales] = useState([]);
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
    return subscribeToBackendDataChanged(() => {
      loadSales().catch(() => {});
    });
  }, [loadSales]);

  const addSale = useCallback(async (newSale) => {
    await apiRequest("/sales", {
      method: "POST",
      body: JSON.stringify(newSale),
    });
    await loadSales();
    notifyBackendDataChanged();
    recordActivity({
      type: "create",
      title: "Sale recorded",
      description: `A sale was recorded for ${newSale.name}.`,
    });
  }, [loadSales]);

  return { sales, analytics, addSale };
}
