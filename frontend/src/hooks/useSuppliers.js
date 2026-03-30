"use client";

import { useState, useCallback, useEffect } from "react";
import { recordActivity } from "@/lib/activityLog";
import { apiRequest } from "@/lib/apiClient";

const initialSuppliers = [
  { id: 1, supplierId: "SUP001", name: "Farm Fresh Suppliers", contactPerson: "Khaalid Hashi", phone: "+252 61 213 7065", email: "khaalid@farmfresh.com", location: "Mogadishu, Somalia", products: "Apples, Bananas, Grapes", rating: 4.8, orders: 45, color: "bg-green-500" },
  { id: 2, supplierId: "SUP002", name: "Tropical Imports Ltd", contactPerson: "Mohamed Abdiaziz", phone: "+252 61 090 9070", email: "Azhari@tropicalimports.com", location: "Doha, Qatar", products: "Mangoes, Pineapples, Avocados", rating: 4.9, orders: 38, color: "bg-blue-500" },
  { id: 3, supplierId: "SUP003", name: "Berry Best Co.", contactPerson: "Khadiijo Hashi", phone: "+252 61 040 6889", email: "khadiijo@berrybest.com", location: "Dubai, UAE", products: "Strawberries, Blueberries", rating: 4.9, orders: 38, color: "bg-purple-500" },
];

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);

  const loadSuppliers = useCallback(async () => {
    const data = await apiRequest("/suppliers");
    setSuppliers(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    loadSuppliers().catch((error) => {
      console.error("Failed to load suppliers", error);
    });
  }, [loadSuppliers]);

  const addSupplier = useCallback(async (newSupplier) => {
    await apiRequest("/suppliers", {
      method: "POST",
      body: JSON.stringify(newSupplier),
    });
    await loadSuppliers();
    recordActivity({
      type: "create",
      title: "Supplier added",
      description: `${newSupplier.name} was added to suppliers.`,
    });
  }, [loadSuppliers]);

  const deleteSupplier = useCallback(async (supplierId) => {
    await apiRequest(`/suppliers/${encodeURIComponent(String(supplierId))}`, {
      method: "DELETE",
    });
    await loadSuppliers();

    recordActivity({
      type: "delete",
      title: "Supplier removed",
      description: `Supplier ${supplierId} was removed from suppliers.`,
    });
  }, [loadSuppliers]);

  const resetSuppliers = useCallback(async () => {
    await apiRequest("/suppliers/reset", {
      method: "POST",
    });
    await loadSuppliers();
    recordActivity({
      type: "update",
      title: "Suppliers reset",
      description: "Supplier list was reset to defaults.",
    });
  }, [loadSuppliers]);

  return { suppliers, addSupplier, deleteSupplier, resetSuppliers };
}
