import React from "react";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";

const items = [
  { name: "Red Apples", category: "Apples", stock: 450, unit: "kg", price: 3.5, expiry: "2025-12-20", status: "In Stock" },
  { name: "Bananas", category: "Tropical", stock: 320, unit: "kg", price: 2.2, expiry: "2025-12-18", status: "In Stock" },
  { name: "Strawberries", category: "Berries", stock: 25, unit: "kg", price: 8.5, expiry: "2025-12-15", status: "Low Stock" },
  { name: "Oranges", category: "Citrus", stock: 380, unit: "kg", price: 3.2, expiry: "2025-12-22", status: "In Stock" },
  { name: "Avocados", category: "Tropical", stock: 15, unit: "kg", price: 6.8, expiry: "2025-12-14", status: "Low Stock" },
  { name: "Blueberries", category: "Berries", stock: 18, unit: "kg", price: 9.0, expiry: "2025-12-19", status: "In Stock" },
  { name: "Mangose", category: "Tropical", stock: 50, unit: "kg", price: 7.5, expiry: "2025-12-21", status: "In Stock" },
  { name: "Grapes", category: "Berries", stock: 60, unit: "kg", price: 4.5, expiry: "2025-12-17", status: "In Stock" },
  { name: "Pineapples", category: "Tropical", stock: 22, unit: "kg", price: 5.0, expiry: "2025-12-16", status: "Low Stock" },
  { name: "Raspberries", category: "Berries", stock: 30, unit: "kg", price: 10.0, expiry: "2025-12-23", status: "In Stock" },
  { name: "Lemons", category: "Citrus", stock: 200, unit: "kg", price: 2.8, expiry: "2025-12-24", status: "In Stock" },
  { name: "Watermelons", category: "Melons", stock: 80, unit: "kg", price: 3.0, expiry: "2025-12-25", status: "In Stock" },

];

function StatusBadge({ status }) {
  const low = status === "Low Stock";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
      ${low ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"}`}
    >
      {status}
    </span>
  );
}

export default function Page() {
  return (
    <>
      <div className="m-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-medium">Inventory Management</h1>
            <p className="text-gray-500">Manage your fruit store and pricing.</p>
          </div>

          <button
            className="inline-flex items-center gap-3 rounded-lg bg-green-500 px-3 py-2 font-medium
                       text-white shadow-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="h-7 w-7" />
            Add New Item
          </button>
        </div>

        {/* inventory searching.... */}
        <div className="mt-6 bg-white px-3 py-2 rounded-2xl shadow-md border border-gray-100 flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-3 flex-1 border border-gray-200 rounded-2xl px-2 py-2">
            <Search className="text-gray-400" size={22} />
            <input
              className="w-full outline-none text-lg text-gray-700 placeholder:text-gray-400"
              placeholder="Search by name or category..."
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg text-lg font-medium bg-gray-100 hover:bg-green-400 transition-colors">
              All
            </button>
            <button className="px-4 py-2 rounded-lg text-lg font-medium bg-gray-100 hover:bg-green-400 transition-colors">
              In Stock
            </button>
            <button className="px-4 py-2 rounded-lg text-lg font-medium bg-gray-100 hover:bg-orange-400 transition-colors">
              Low Stock
            </button>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER (this is what makes it look like the picture) */}
      <div className="mx-8 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-green-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y">
            {items.map((item) => {
              const low = item.status === "Low Stock";
              return (
                <tr key={item.name} className="hover:bg-gray-50">
                  {/* Name with avatar */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-green-500 text-white flex items-center justify-center font-semibold">
                        {item.name[0]}
                      </div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-700">{item.category}</td>

                  <td className={`px-6 py-5 ${low ? "text-orange-600 font-semibold" : "text-gray-900"}`}>
                    {item.stock} {item.unit}
                  </td>

                  <td className="px-6 py-5 text-gray-900">${item.price.toFixed(2)}</td>

                  <td className="px-6 py-5 text-gray-700">{item.expiry}</td>

                  <td className="px-6 py-5">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Pencil size={18} />
                      </button>
                      <button className="text-red-600 hover:text-gray-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="mx-8 mt-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h3 className="text-gray-500 text-lg">Total Items</h3>
            <p className="mt-3 text-2xl font-semibold text-gray-600">12</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h3 className="text-gray-500 text-lg">Total Stock Value</h3>
            <p className="mt-3 text-2xl font-semibold text-gray-600">$66</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h3 className="text-gray-500 text-lg">Low Stock Items</h3>
            <p className="mt-3 text-2xl font-semibold text-orange-600">3</p>
          </div>
        </div>
    </section>
    </>
  );
}