"use client";

import React, { useState, useMemo } from "react";
import { CircleCheckBig, Clock4, Package, Eye, Trash2, Pencil, Plus } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import CreateOrderModal from "../components/CreateOrderModal";
import EditOrderModal from "../components/EditOrderModal";
import ViewOrderModal from "../components/ViewOrderModal";
import { cn } from "@/lib/utils";

function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        status === "Delivered" && "bg-green-100 text-green-700",
        status === "Processing" && "bg-blue-100 text-blue-700",
        status === "Pending" && "bg-orange-100 text-orange-700",
        !["Delivered", "Processing", "Pending"].includes(status) && "bg-gray-100 text-gray-700"
      )}
    >
      {status}
    </span>
  );
}

export default function OrderPage() {
  const { orders, addOrder, deleteOrder, updateOrder } = useOrders();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const processing = orders.filter((o) => o.status === "Processing").length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    return { delivered, processing, pending, total: orders.length };
  }, [orders]);

  return (
    <>
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage all customer orders</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-green-200 text-sm font-medium"
        >
          <Plus size={18} />
          Create New Order
        </button>
      </div>

      {/* KPI Cards */}
      <section className="px-8 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <CircleCheckBig className="bg-green-100 p-2 rounded-xl text-green-600 h-11 w-11 mb-4" size={28} />
            <p className="text-gray-500 text-sm font-medium">Delivered</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.delivered}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Clock4 className="bg-blue-100 p-2 rounded-xl text-blue-600 h-11 w-11 mb-4" size={28} />
            <p className="text-gray-500 text-sm font-medium">Processing</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.processing}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Package className="bg-orange-100 p-2 rounded-xl text-orange-600 h-11 w-11 mb-4" size={28} />
            <p className="text-gray-500 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Package className="bg-gray-100 p-2 rounded-xl text-gray-600 h-11 w-11 mb-4" size={28} />
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
        </div>
      </section>

      {/* Table */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">All Orders</h3>
            <span className="text-sm text-gray-400">{orders.length} orders</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-green-50 text-gray-500 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {orders.map((o) => (
                <tr key={o.orderId} className="hover:bg-green-50/30 transition-colors">
                  <td className="px-6 py-4 text-blue-600 font-semibold text-sm">{o.orderId}</td>
                  <td className="px-6 py-4 font-medium text-sm text-gray-900">{o.customer}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{o.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{o.items} items</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${o.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewOrder(o)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setEditOrder(o)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Order"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteOrder(o.orderId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">No orders found.</div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdd={addOrder}
      />
      <EditOrderModal
        isOpen={!!editOrder}
        order={editOrder}
        onClose={() => setEditOrder(null)}
        onSave={(updated) => {
          updateOrder(updated);
          setEditOrder(null);
        }}
      />
      <ViewOrderModal
        isOpen={!!viewOrder}
        order={viewOrder}
        onClose={() => setViewOrder(null)}
      />
    </>
  );
}