"use client";

import React, { useState, useMemo } from "react";
import { CircleCheckBig, Clock4, Package, Plus, Eye, Pencil } from "lucide-react";
import { usePurchases } from "@/hooks/usePurchases";
import NewPurchaseModal from "../components/NewPurchaseModal";
import ViewPurchaseModal from "../components/ViewPurchaseModal";

function StatusBadge({ status }) {
  const done = status === "Completed";
  const pending = status === "Pending";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
        ${done ? "bg-green-100 text-green-700" : pending ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

export default function PurchasePage() {
  const { purchases, addPurchase, updatePurchaseStatus } = usePurchases();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPurchase, setViewPurchase] = useState(null);

  const stats = useMemo(() => {
    const totalAmount = purchases.reduce((acc, p) => acc + p.amount, 0);
    const totalQty = purchases.reduce((acc, p) => {
      if (typeof p.quantity === 'number') return acc + p.quantity;
      const match = String(p.quantity).match(/(\d+)/);
      return acc + (match ? parseInt(match[1]) : 0);
    }, 0);
    const pendingCount = purchases.filter(p => p.status === "Pending").length;
    const completedCount = purchases.filter(p => p.status === "Completed").length;
    return { totalAmount, totalQty, pendingCount, completedCount };
  }, [purchases]);

  return (
    <>
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
          <p className="font-light text-gray-500 text-sm mt-1">Manage supplier purchases and inventory restocking</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200 text-sm font-medium"
        >
          <Plus size={18} />
          New Purchase
        </button>
      </div>

      {/* KPI Cards */}
      <section className="px-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <CircleCheckBig className="bg-green-100 p-2 rounded-xl text-green-600 h-11 w-11 mb-4" size={28} />
            <p className="text-gray-500 text-sm font-medium">Total Purchases</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Clock4 className="bg-blue-100 p-2 rounded-xl text-blue-600 h-11 w-11 mb-4" size={28} />
            <p className="text-gray-500 text-sm font-medium">Total Quantity</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalQty.toLocaleString()} kg</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Package className="bg-orange-100 p-2 rounded-xl text-orange-600 h-11 w-11 mb-4" size={28} />
            <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">{stats.pendingCount}</p>
          </div>
        </div>
      </section>

      {/* Table */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Order History</h3>
            <span className="text-sm text-gray-400">{purchases.length} purchases</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-gray-500 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Purchase ID</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-center">Quantity</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchases.map((p) => (
                <tr key={p.purchaseId} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-6 py-4 text-blue-600 font-semibold text-sm">{p.purchaseId}</td>
                  <td className="px-6 py-4 font-medium text-sm text-gray-900">{p.supplier}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{p.date}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{p.items}</td>
                  <td className="px-6 py-4 text-center font-medium text-sm">{p.quantity}</td>
                  <td className="px-6 py-4 text-center font-bold text-sm text-gray-900">${p.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewPurchase(p)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => updatePurchaseStatus(p.purchaseId, p.status === "Pending" ? "Completed" : "Pending")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Toggle Status"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewPurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addPurchase} />
      <ViewPurchaseModal isOpen={!!viewPurchase} purchase={viewPurchase} onClose={() => setViewPurchase(null)} />
    </>
  );
}