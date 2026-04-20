"use client";

import React, { useState, useMemo } from 'react';
import { Users, Star, Phone, Mail, MapPin, Plus, X, Package, Calendar, ExternalLink, Trash2, RotateCcw, Pencil } from 'lucide-react';
import { useSuppliers } from "@/hooks/useSuppliers";
import { useOrders } from "@/hooks/useOrders";
import { usePurchases } from "@/hooks/usePurchases";
import AddSupplierModal from "../components/AddSupplierModal";
import EditSupplierModal from "../components/EditSupplierModal";

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, resetSuppliers } = useSuppliers();
  const { orders } = useOrders();
  const { purchases } = usePurchases();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const stats = useMemo(() => {
    return {
      total: suppliers.length,
      active: suppliers.length, // Simplified
      orders: orders.length
    };
  }, [suppliers, orders]);

  const purchaseOrderCountMap = useMemo(() => {
    return purchases.reduce((acc, item) => {
      const key = item.supplier?.trim().toLowerCase();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [purchases]);

  const supplierOrders = useMemo(() => {
    if (!selectedSupplier) return [];
    const supplierName = selectedSupplier.name.trim().toLowerCase();

    const supplierPurchases = purchases
      .filter((item) => item.supplier?.trim().toLowerCase() === supplierName)
      .map((item) => ({
        id: item.purchaseId,
        type: "Purchase",
        date: item.date,
        status: item.status,
        items: item.items,
        quantity: item.quantity,
        amount: item.amount,
      }));

    const relatedCustomerOrders = orders
      .filter((item) => item.customer?.trim().toLowerCase() === supplierName)
      .map((item) => ({
        id: item.orderId,
        type: "Customer Order",
        date: item.date,
        status: item.status,
        items: item.items,
        quantity: "-",
        amount: item.total,
      }));

    return [...supplierPurchases, ...relatedCustomerOrders].sort((a, b) => (
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, [purchases, orders, selectedSupplier]);

  const selectedSupplierSummary = useMemo(() => {
    if (!selectedSupplier) return null;
    const completed = supplierOrders.filter((item) => item.status === "Completed" || item.status === "Delivered").length;
    const pending = supplierOrders.filter((item) => item.status === "Pending" || item.status === "Processing").length;
    const totalAmount = supplierOrders.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      completed,
      pending,
      totalAmount,
      records: supplierOrders.length,
    };
  }, [supplierOrders, selectedSupplier]);

  const openContact = (supplier) => {
    setSelectedSupplier(supplier);
    setIsContactOpen(true);
  };

  const openOrders = (supplier) => {
    setSelectedSupplier(supplier);
    setIsOrdersOpen(true);
  };

  const closeContact = () => {
    setIsContactOpen(false);
    setSelectedSupplier(null);
  };

  const closeOrders = () => {
    setIsOrdersOpen(false);
    setSelectedSupplier(null);
  };

  const handleDeleteSupplier = (supplier) => {
    const confirmed = window.confirm(`Delete ${supplier.name} from suppliers?`);
    if (!confirmed) return;

    deleteSupplier(supplier.supplierId || supplier.id);

    if ((selectedSupplier?.supplierId || selectedSupplier?.id) === (supplier.supplierId || supplier.id)) {
      closeContact();
      closeOrders();
    }
  };

  const handleResetSuppliers = () => {
    const confirmed = window.confirm("Reset all suppliers back to the default list?");
    if (!confirmed) return;

    resetSuppliers();
    closeContact();
    closeOrders();
  };

  return (
    <>
      <div className='p-6 flex justify-between items-start'>
        <div>
          <h1 className='text-2xl font-medium text-slate-900 dark:text-white'>Suppliers Management</h1>
          <p className='font-light text-gray-500 dark:text-slate-400 text-sm'>Manage your fruit suppliers and contacts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSuppliers}
            className="flex items-center gap-2 border border-orange-300 text-orange-700 dark:text-orange-300 px-4 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
          >
            <RotateCcw size={18} />
            Reset Suppliers
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200 dark:shadow-none"
          >
            <Plus size={20} />
            Add Supplier
          </button>
        </div>
      </div>

      <section className="flex flex-wrap gap-6 w-full px-8 mb-8">
        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 flex-1 min-w-[260px]">
          <Users className="bg-green-100 p-2 rounded-lg text-green-600 h-12 w-11" size={33} />
          <div className="mt-4">
            <h4 className="text-gray-500 dark:text-slate-400 font-light text-sm">Total Suppliers</h4>
            <h3 className="text-3xl text-slate-900 dark:text-white font-medium mt-1">{stats.total}</h3>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 flex-1 min-w-[260px]">
          <Users className="bg-blue-100 p-2 rounded-lg text-blue-600 h-12 w-11" size={33} />
          <div className="mt-4">
            <h4 className="text-gray-500 dark:text-slate-400 font-light text-sm">Active Partnerships</h4>
            <h3 className="text-3xl text-slate-900 dark:text-white font-medium mt-1">{stats.active}</h3>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 flex-1 min-w-[260px]">
          <Users className="bg-orange-100 p-2 rounded-lg text-orange-600 h-12 w-11" size={33} />
          <div className="mt-4">
            <h4 className="text-gray-500 dark:text-slate-400 font-light text-sm">Total Orders</h4>
            <h3 className="text-3xl text-slate-900 dark:text-white font-medium mt-1">{stats.orders}</h3>
          </div>
        </div>
      </section>

      <section className="mx-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {suppliers.map((s) => (
            <div key={s.supplierId || s.id} className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 flex flex-col h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className={`h-16 w-16 rounded-2xl ${s.color || 'bg-green-500'} flex items-center justify-center text-white shrink-0`}>
                  <Users size={30} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">{s.name}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm">{s.contactPerson}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="font-medium">{s.rating}</span>
                    <span className="text-xs">({purchaseOrderCountMap[s.name.trim().toLowerCase()] || s.orders || 0} orders)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 dark:text-slate-400 flex-grow">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400 dark:text-slate-500" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400 dark:text-slate-500" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400 dark:text-slate-500" />
                  <span className="truncate">{s.location}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/10">
                  <p className="text-gray-400 dark:text-slate-500 text-xs uppercase font-medium">Main Products</p>
                  <p className="mt-1 text-gray-700 dark:text-slate-200 font-medium">{s.products}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => openContact(s)}
                  className="rounded-xl bg-gray-50 dark:bg-white/5 dark:text-slate-200 py-2.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  Contact
                </button>
                <button
                  onClick={() => openOrders(s)}
                  className="rounded-xl border border-green-500 py-2.5 text-sm font-medium text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                >
                  View Orders
                </button>
              </div>

              <button
                onClick={() => setEditingSupplier(s)}
                className="mt-3 w-full rounded-xl border border-blue-200 dark:border-blue-400/20 text-blue-700 dark:text-blue-300 py-2.5 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <Pencil size={16} />
                Edit Supplier
              </button>

              <button
                onClick={() => handleDeleteSupplier(s)}
                className="mt-3 w-full rounded-xl border border-red-200 dark:border-red-400/20 text-red-700 dark:text-red-300 py-2.5 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete Supplier
              </button>
            </div>
          ))}
        </div>
      </section>

      <AddSupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addSupplier} />
      <EditSupplierModal
        isOpen={!!editingSupplier}
        supplier={editingSupplier}
        onClose={() => setEditingSupplier(null)}
        onSave={(updatedSupplier) => {
          updateSupplier(updatedSupplier, editingSupplier?.supplierId || editingSupplier?.id);
          setEditingSupplier(null);
        }}
      />

      {isContactOpen && selectedSupplier ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10">
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Supplier Contact</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{selectedSupplier.name}</p>
              </div>
              <button
                onClick={closeContact}
                className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 grid gap-3">
              <a
                href={`tel:${selectedSupplier.phone}`}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-green-600" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedSupplier.phone}</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-gray-400" />
              </a>

              <a
                href={`mailto:${selectedSupplier.email}?subject=Fruit%20Store%20Inquiry`}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail size={18} className="text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 uppercase font-medium">Email</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{selectedSupplier.email || "No email saved"}</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-gray-400 shrink-0" />
              </a>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={closeContact}
                className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isOrdersOpen && selectedSupplier ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Supplier Orders</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedSupplier.name}</p>
              </div>
              <button
                onClick={closeOrders}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pt-6 pb-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-gray-400 text-xs uppercase font-medium">Contact Person</p>
                  <p className="text-gray-800 font-medium mt-1">{selectedSupplier.contactPerson}</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-gray-400 text-xs uppercase font-medium">Products</p>
                  <p className="text-gray-800 font-medium mt-1">{selectedSupplier.products}</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-gray-400 text-xs uppercase font-medium">Phone</p>
                  <p className="text-gray-800 font-medium mt-1">{selectedSupplier.phone}</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-gray-400 text-xs uppercase font-medium">Location</p>
                  <p className="text-gray-800 font-medium mt-1">{selectedSupplier.location}</p>
                </div>
              </div>

              {selectedSupplierSummary ? (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="rounded-lg bg-gray-50 p-2 text-center">
                    <p className="text-xs text-gray-400 uppercase">Records</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedSupplierSummary.records}</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2 text-center">
                    <p className="text-xs text-green-600 uppercase">Completed</p>
                    <p className="text-sm font-semibold text-green-700">{selectedSupplierSummary.completed}</p>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-2 text-center">
                    <p className="text-xs text-orange-600 uppercase">Pending</p>
                    <p className="text-sm font-semibold text-orange-700">{selectedSupplierSummary.pending}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2 text-center">
                    <p className="text-xs text-blue-600 uppercase">Amount</p>
                    <p className="text-sm font-semibold text-blue-700">${selectedSupplierSummary.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-6 pt-4 space-y-3 max-h-[360px] overflow-y-auto">
              {supplierOrders.length > 0 ? (
                supplierOrders.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{item.id}</p>
                        <span className="text-[11px] rounded-full px-2 py-0.5 bg-blue-100 text-blue-700 font-medium">{item.type}</span>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${(item.status === "Completed" || item.status === "Delivered") ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
                      <p className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" />{item.date}</p>
                      <p className="flex items-center gap-2"><Package size={14} className="text-gray-400" />{item.quantity === "-" ? "-" : `${item.quantity} kg`}</p>
                      <p>Items: <span className="font-medium text-gray-800">{item.items}</span></p>
                      <p>Amount: <span className="font-medium text-gray-800">${Number(item.amount).toFixed(2)}</span></p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center">
                  <p className="text-gray-600 font-medium">No orders found for this supplier.</p>
                  <p className="text-gray-400 text-sm mt-1">Orders appear when purchase supplier names match this supplier exactly.</p>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={closeOrders}
                className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
