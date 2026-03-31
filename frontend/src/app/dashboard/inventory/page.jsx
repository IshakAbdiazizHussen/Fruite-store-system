
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useSearchParams } from "next/navigation";
import AddItemModal from "../components/AddItemModal";
import EditItemModal from "../components/EditItemModal";
import ViewItemModal from "../components/ViewItemModal";
import { cn } from "@/lib/utils";

function StatusBadge({ status }) {
  const low = status === "Low Stock";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
      ${low ? "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300" : "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300"}`}
    >
      {status}
    </span>
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  const { items, addItem, deleteItem, updateItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    const fromNavbar = searchParams.get("search") || "";
    setSearchTerm(fromNavbar);
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "In Stock" && item.status === "In Stock") ||
        (filter === "Low Stock" && item.status === "Low Stock");

      return matchesSearch && matchesFilter;
    });
  }, [items, searchTerm, filter]);

  const totalItems = items.length;
  const totalStockValue = items.reduce((acc, item) => acc + (item.stock * item.price), 0);
  const lowStockCount = items.filter(item => item.status === "Low Stock").length;

  return (
    <>
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Inventory Management</h1>
          <p className="text-sm mt-1 text-gray-500 dark:text-slate-400">Manage your fruit stock, pricing and expiry dates.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200 dark:shadow-none text-sm font-medium"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {/* KPI Cards */}
      <section className="px-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Items</p>
            <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">{totalItems}</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Products in inventory</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Stock Value</p>
            <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
              ${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Current inventory valuation</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Low Stock Alerts</p>
            <p className="mt-2 text-3xl font-bold text-orange-500">{lowStockCount}</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Items needing restock</p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="px-8 mb-6">
        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex items-center gap-3 flex-1 border border-gray-200 rounded-xl px-3 py-2 dark:border-white/10 dark:bg-slate-950/60">
            <Search className="text-gray-400 dark:text-slate-500 shrink-0" size={18} />
            <input
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 dark:text-slate-200 dark:placeholder:text-slate-500"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "In Stock", "Low Stock"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  filter === f
                    ? "bg-green-500 text-white shadow-md shadow-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/10 dark:bg-slate-900/80">
          <table className="w-full text-left">
            <thead className="bg-green-50 text-gray-500 text-xs uppercase font-semibold tracking-wider dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 dark:divide-white/10 dark:text-slate-300">
              {filteredItems.map((item) => {
                const low = item.status === "Low Stock";
                return (
                  <tr key={item.name} className="hover:bg-green-50/30 transition-colors dark:hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {item.name[0]}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{item.category}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${low ? "text-orange-500" : "text-gray-900 dark:text-white"}`}>
                      {item.stock} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{item.expiry}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewItem(item)}
                          className="p-2 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditItem(item)}
                          className="p-2 text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteItem(item.name)}
                          className="p-2 text-red-500 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-gray-400 dark:text-slate-500 text-sm">
              No items found matching your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addItem}
      />
      <EditItemModal
        isOpen={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={(updated) => {
          updateItem(updated, editItem?.name);
          setEditItem(null);
        }}
      />
      <ViewItemModal
        isOpen={!!viewItem}
        item={viewItem}
        onClose={() => setViewItem(null)}
      />
    </>
  );
}
