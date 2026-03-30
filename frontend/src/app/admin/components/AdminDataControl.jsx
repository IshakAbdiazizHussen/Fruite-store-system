"use client";

import { useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useOrders } from "@/hooks/useOrders";
import { usePurchases } from "@/hooks/usePurchases";
import { useSales } from "@/hooks/useSales";
import { useSuppliers } from "@/hooks/useSuppliers";

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

const sectionMeta = {
  all: {
    eyebrow: "Backend Control",
    title: "Manage backend sections",
    description: "Open one control area at a time to add, update, or clean up live backend records.",
  },
  inventory: {
    eyebrow: "Inventory Control",
    title: "Edit inventory data",
    description: "Add stock items, update quantities, and remove old inventory records.",
  },
  orders: {
    eyebrow: "Orders Control",
    title: "Edit order data",
    description: "Create customer orders, update their status, and remove incorrect entries.",
  },
  purchases: {
    eyebrow: "Purchases Control",
    title: "Edit purchase data",
    description: "Manage supplier purchases and keep the purchase workflow updated.",
  },
  sales: {
    eyebrow: "Sales Control",
    title: "Edit sales data",
    description: "Record sales and review the latest revenue entries from the backend only.",
  },
  suppliers: {
    eyebrow: "Suppliers Control",
    title: "Edit supplier data",
    description: "Add supplier contacts, remove old suppliers, and reset the supplier list.",
  },
};

export default function AdminDataControl({ section = "all" }) {
  const meta = sectionMeta[section] || sectionMeta.all;
  const { items, addItem, deleteItem, updateItem } = useInventory();
  const { orders, addOrder, deleteOrder, updateOrderStatus } = useOrders();
  const { purchases, addPurchase, updatePurchaseStatus } = usePurchases();
  const { sales, addSale } = useSales();
  const { suppliers, addSupplier, deleteSupplier, resetSuppliers } = useSuppliers();

  const [inventoryForm, setInventoryForm] = useState({
    name: "",
    category: "Apples",
    stock: "",
    unit: "kg",
    price: "",
    expiry: "",
  });
  const [orderForm, setOrderForm] = useState({
    customer: "",
    items: "",
    total: "",
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
  });
  const [purchaseForm, setPurchaseForm] = useState({
    supplier: "",
    items: "",
    quantity: "",
    amount: "",
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
  });
  const [saleForm, setSaleForm] = useState({
    name: "",
    units: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    location: "",
    products: "",
  });

  async function handleInventorySubmit(event) {
    event.preventDefault();
    await addItem({
      ...inventoryForm,
      stock: Number(inventoryForm.stock),
      price: Number(inventoryForm.price),
    });
    setInventoryForm({
      name: "",
      category: "Apples",
      stock: "",
      unit: "kg",
      price: "",
      expiry: "",
    });
  }

  async function handleOrderSubmit(event) {
    event.preventDefault();
    await addOrder({
      ...orderForm,
      items: Number(orderForm.items),
      total: Number(orderForm.total),
    });
    setOrderForm({
      customer: "",
      items: "",
      total: "",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });
  }

  async function handlePurchaseSubmit(event) {
    event.preventDefault();
    await addPurchase({
      ...purchaseForm,
      amount: Number(purchaseForm.amount),
      quantity: `${purchaseForm.quantity} kg`,
    });
    setPurchaseForm({
      supplier: "",
      items: "",
      quantity: "",
      amount: "",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });
  }

  async function handleSaleSubmit(event) {
    event.preventDefault();
    await addSale({
      ...saleForm,
      units: Number(saleForm.units),
      price: Number(saleForm.price),
      total: Number(saleForm.units) * Number(saleForm.price),
    });
    setSaleForm({
      name: "",
      units: "",
      price: "",
      date: new Date().toISOString().split("T")[0],
    });
  }

  async function handleSupplierSubmit(event) {
    event.preventDefault();
    await addSupplier(supplierForm);
    setSupplierForm({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      location: "",
      products: "",
    });
  }

  const showAll = section === "all";
  const showInventory = showAll || section === "inventory";
  const showOrders = showAll || section === "orders";
  const showPurchases = showAll || section === "purchases";
  const showSales = showAll || section === "sales";
  const showSuppliers = showAll || section === "suppliers";

  return (
    <div className="space-y-8 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">{meta.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{meta.title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meta.description}</p>
      </div>

      {showInventory ? (
        <SectionCard title="Inventory" description="Add stock items and adjust the current product list.">
          <form onSubmit={handleInventorySubmit} className="grid gap-3 md:grid-cols-6">
            <Input value={inventoryForm.name} onChange={(e) => setInventoryForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Item name" />
            <Select value={inventoryForm.category} onChange={(e) => setInventoryForm((prev) => ({ ...prev, category: e.target.value }))} options={["Apples", "Tropical", "Berries", "Citrus", "Melons", "Others"]} />
            <Input value={inventoryForm.stock} onChange={(e) => setInventoryForm((prev) => ({ ...prev, stock: e.target.value }))} placeholder="Stock" type="number" />
            <Select value={inventoryForm.unit} onChange={(e) => setInventoryForm((prev) => ({ ...prev, unit: e.target.value }))} options={["kg", "pcs", "box"]} />
            <Input value={inventoryForm.price} onChange={(e) => setInventoryForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Price" type="number" />
            <Input value={inventoryForm.expiry} onChange={(e) => setInventoryForm((prev) => ({ ...prev, expiry: e.target.value }))} placeholder="Expiry" type="date" />
            <button type="submit" className="md:col-span-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Add Inventory Item
            </button>
          </form>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {items.slice(0, 8).map((item) => (
                  <tr key={item.name}>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{item.name}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{item.stock} {item.unit}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">${Number(item.price).toFixed(2)}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{item.status}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateItem({ ...item, stock: Number(item.stock) + 10 })}
                          className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-200 dark:hover:bg-blue-500/10"
                        >
                          +10 stock
                        </button>
                        <button
                          onClick={() => deleteItem(item.name)}
                          className="rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-400/30 dark:text-red-200 dark:hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}

      {showOrders ? (
        <SectionCard title="Orders" description="Create customer orders and update their status directly here.">
          <form onSubmit={handleOrderSubmit} className="grid gap-3 md:grid-cols-5">
            <Input value={orderForm.customer} onChange={(e) => setOrderForm((prev) => ({ ...prev, customer: e.target.value }))} placeholder="Customer" />
            <Input value={orderForm.items} onChange={(e) => setOrderForm((prev) => ({ ...prev, items: e.target.value }))} placeholder="Items" type="number" />
            <Input value={orderForm.total} onChange={(e) => setOrderForm((prev) => ({ ...prev, total: e.target.value }))} placeholder="Total" type="number" />
            <Select value={orderForm.status} onChange={(e) => setOrderForm((prev) => ({ ...prev, status: e.target.value }))} options={["Pending", "Processing", "Delivered"]} />
            <Input value={orderForm.date} onChange={(e) => setOrderForm((prev) => ({ ...prev, date: e.target.value }))} placeholder="Date" type="date" />
            <button type="submit" className="md:col-span-5 inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Create Order
            </button>
          </form>

          <div className="mt-6 grid gap-3">
            {orders.slice(0, 8).map((order) => (
              <div key={order.orderId} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{order.orderId} - {order.customer}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{order.items} items • ${Number(order.total).toFixed(2)} • {order.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                    options={["Pending", "Processing", "Delivered"]}
                  />
                  <button onClick={() => deleteOrder(order.orderId)} className="rounded-xl border border-red-200 p-3 text-red-700 hover:bg-red-50 dark:border-red-400/30 dark:text-red-200 dark:hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {showPurchases || showSales ? (
        <div className="grid gap-8 xl:grid-cols-2">
          {showPurchases ? (
            <SectionCard title="Purchases" description="Create supplier purchases and flip their workflow status.">
              <form onSubmit={handlePurchaseSubmit} className="grid gap-3 md:grid-cols-2">
                <Input value={purchaseForm.supplier} onChange={(e) => setPurchaseForm((prev) => ({ ...prev, supplier: e.target.value }))} placeholder="Supplier" />
                <Input value={purchaseForm.items} onChange={(e) => setPurchaseForm((prev) => ({ ...prev, items: e.target.value }))} placeholder="Items" />
                <Input value={purchaseForm.quantity} onChange={(e) => setPurchaseForm((prev) => ({ ...prev, quantity: e.target.value }))} placeholder="Quantity (kg)" type="number" />
                <Input value={purchaseForm.amount} onChange={(e) => setPurchaseForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Amount" type="number" />
                <Select value={purchaseForm.status} onChange={(e) => setPurchaseForm((prev) => ({ ...prev, status: e.target.value }))} options={["Pending", "Completed"]} />
                <Input value={purchaseForm.date} onChange={(e) => setPurchaseForm((prev) => ({ ...prev, date: e.target.value }))} placeholder="Date" type="date" />
                <button type="submit" className="md:col-span-2 inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">
                  <Plus className="h-4 w-4" />
                  Add Purchase
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {purchases.slice(0, 6).map((purchase) => (
                  <div key={purchase.purchaseId} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10 dark:bg-slate-950/40">
                    <p className="font-semibold text-slate-900 dark:text-white">{purchase.purchaseId} - {purchase.supplier}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{purchase.items} • {purchase.quantity} • ${Number(purchase.amount).toFixed(2)}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => updatePurchaseStatus(purchase.purchaseId, purchase.status === "Pending" ? "Completed" : "Pending")}
                        className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-200 dark:hover:bg-blue-500/10"
                      >
                        Mark {purchase.status === "Pending" ? "Completed" : "Pending"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {showSales ? (
            <SectionCard title="Sales" description="Record new sales and review the latest revenue entries.">
              <form onSubmit={handleSaleSubmit} className="grid gap-3 md:grid-cols-2">
                <Input value={saleForm.name} onChange={(e) => setSaleForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Product name" />
                <Input value={saleForm.units} onChange={(e) => setSaleForm((prev) => ({ ...prev, units: e.target.value }))} placeholder="Units" type="number" />
                <Input value={saleForm.price} onChange={(e) => setSaleForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Price per unit" type="number" />
                <Input value={saleForm.date} onChange={(e) => setSaleForm((prev) => ({ ...prev, date: e.target.value }))} placeholder="Date" type="date" />
                <button type="submit" className="md:col-span-2 inline-flex w-fit items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">
                  <Plus className="h-4 w-4" />
                  Record Sale
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {sales.slice(0, 6).map((sale) => (
                  <div key={sale.saleId || sale.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10 dark:bg-slate-950/40">
                    <p className="font-semibold text-slate-900 dark:text-white">{sale.saleId || sale.id} - {sale.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sale.units} units • ${Number(sale.total).toFixed(2)} • {sale.date}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}
        </div>
      ) : null}

      {showSuppliers ? (
        <SectionCard title="Suppliers" description="Add supplier records, remove old ones, or reset the list to defaults.">
          <form onSubmit={handleSupplierSubmit} className="grid gap-3 md:grid-cols-3">
            <Input value={supplierForm.name} onChange={(e) => setSupplierForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Company name" />
            <Input value={supplierForm.contactPerson} onChange={(e) => setSupplierForm((prev) => ({ ...prev, contactPerson: e.target.value }))} placeholder="Contact person" />
            <Input value={supplierForm.phone} onChange={(e) => setSupplierForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" />
            <Input value={supplierForm.email} onChange={(e) => setSupplierForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" />
            <Input value={supplierForm.location} onChange={(e) => setSupplierForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Location" />
            <Input value={supplierForm.products} onChange={(e) => setSupplierForm((prev) => ({ ...prev, products: e.target.value }))} placeholder="Products" />
            <div className="md:col-span-3 flex flex-wrap gap-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
                Add Supplier
              </button>
              <button type="button" onClick={resetSuppliers} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
                <RotateCcw className="h-4 w-4" />
                Reset Suppliers
              </button>
            </div>
          </form>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {suppliers.slice(0, 6).map((supplier) => (
              <div key={supplier.supplierId || supplier.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="font-semibold text-slate-900 dark:text-white">{supplier.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{supplier.contactPerson} • {supplier.location}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{supplier.products}</p>
                <button
                  onClick={() => deleteSupplier(supplier.supplierId || supplier.id)}
                  className="mt-4 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-400/30 dark:text-red-200 dark:hover:bg-red-500/10"
                >
                  Delete Supplier
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
