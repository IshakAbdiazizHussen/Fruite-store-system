"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { usePurchases } from "@/hooks/usePurchases";
import { useSuppliers } from "@/hooks/useSuppliers";

const items = [
  { name: "Avocados", stock: "15 kg", reorder: "50 kg", days: "2 days", status: "Critical" },
  { name: "Strawberries", stock: "25 kg", reorder: "60 kg", days: "3 days", status: "Critical" },
  { name: "Bananas", stock: "30 kg", reorder: "100 kg", days: "4 days", status: "Warning" },
];

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
              <tr
                key={item.name}
                className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors"
              >
                <td className="px-8 py-5 text-sm font-semibold text-gray-800">{item.name}</td>
                <td className="px-6 py-5 text-sm font-bold text-red-500">
                  {item.stock} {item.unit}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500">{item.reorder}</td>
                <td className={`px-6 py-5 text-sm font-semibold ${getDaysClass(item.days)}`}>
                  {item.days <= 2 && (
                    <AlertTriangle size={13} className="inline mr-1 mb-0.5" />
                  )}
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
