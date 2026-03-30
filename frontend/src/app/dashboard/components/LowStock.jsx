"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { usePurchases } from "@/hooks/usePurchases";
import { useSuppliers } from "@/hooks/useSuppliers";

const reorderData = {
  Avocados: { reorder: "50 kg", days: 2, urgency: "Critical" },
  Strawberries: { reorder: "60 kg", days: 3, urgency: "Critical" },
  Pineapples: { reorder: "50 kg", days: 5, urgency: "Warning" },
  Blueberries: { reorder: "40 kg", days: 4, urgency: "Warning" },
};

export default function LowStock() {
  const { items, updateItem } = useInventory();
  const { addPurchase } = usePurchases();
  const { suppliers } = useSuppliers();
  const [processing, setProcessing] = useState({});
  const [notice, setNotice] = useState("");

  const lowStockItems = useMemo(() => {
    return items
      .filter((item) => item.stock < 50)
      .map((item) => ({
        ...item,
        ...(reorderData[item.name] || { reorder: "50 kg", days: 5, urgency: "Warning" }),
      }));
  }, [items]);

  const parseReorderKg = (value) => {
    const parsed = Number(String(value).replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 50;
  };

  const getPreferredSupplier = (fruitName) => {
    const name = fruitName.toLowerCase();
    const match = suppliers.find((supplier) => supplier.products?.toLowerCase().includes(name));
    return match?.name || suppliers[0]?.name || "Farm Fresh Suppliers";
  };

  const reorderSingleItem = (item) => {
    const reorderTarget = parseReorderKg(item.reorder);
    const quantityToAdd = Math.max(0, reorderTarget - Number(item.stock || 0));
    if (quantityToAdd <= 0) return false;

    const nextStock = Number(item.stock || 0) + quantityToAdd;
    updateItem({
      ...item,
      stock: nextStock,
      status: nextStock < 50 ? "Low Stock" : "In Stock",
    });

    addPurchase({
      supplier: getPreferredSupplier(item.name),
      items: item.name,
      quantity: quantityToAdd,
      amount: Number((quantityToAdd * Number(item.price || 0)).toFixed(2)),
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });

    return true;
  };

  const handleReorder = (item) => {
    setProcessing((prev) => ({ ...prev, [item.name]: true }));
    const done = reorderSingleItem(item);
    setProcessing((prev) => ({ ...prev, [item.name]: false }));
    setNotice(done ? `${item.name} reordered successfully.` : `${item.name} already meets reorder level.`);
  };

  const handleReorderAll = () => {
    let count = 0;
    lowStockItems.forEach((item) => {
      if (reorderSingleItem(item)) count += 1;
    });
    setNotice(count > 0 ? `Reordered ${count} low stock item(s).` : "All low stock items already meet reorder level.");
  };

  if (lowStockItems.length === 0) return null;

  const getDaysClass = (days) => (days <= 2 ? "text-red-500" : "text-orange-400");
  const getUrgencyBadge = (urgency) =>
    urgency === "Critical"
      ? "bg-red-50 text-red-500 border border-red-200"
      : "bg-orange-50 text-orange-500 border border-orange-200";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
            <p className="text-sm text-gray-400 mt-0.5">Items requiring immediate attention</p>
            {notice ? <p className="text-xs text-green-600 mt-2">{notice}</p> : null}
          </div>
          <button
            onClick={handleReorderAll}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-green-200 whitespace-nowrap"
          >
            Reorder All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-8 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Fruit Name</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Current Stock</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Reorder Level</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Days to Expiry</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.map((item) => (
              <tr key={item.name} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                <td className="px-8 py-5 text-sm font-semibold text-gray-800">{item.name}</td>
                <td className="px-6 py-5 text-sm font-bold text-red-500">
                  {item.stock} {item.unit}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500">{item.reorder}</td>
                <td className={`px-6 py-5 text-sm font-semibold ${getDaysClass(item.days)}`}>
                  {item.days <= 2 ? <AlertTriangle size={13} className="inline mr-1 mb-0.5" /> : null}
                  {item.days} days
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getUrgencyBadge(item.urgency)}`}>
                    {item.urgency}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => handleReorder(item)}
                    disabled={!!processing[item.name]}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-green-200"
                  >
                    {processing[item.name] ? "Reordering..." : "Reorder"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
