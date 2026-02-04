import React from "react";
import { CircleCheckBig, Clock4, Package } from "lucide-react";
import { purchase } from "@/app/data/page";


function StatusBadge({ status }) {
  const done = status === "Completed";
  const pending = status === "Pending";

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-light
        ${done ? "bg-green-100 text-green-700" : pending ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

export default function PurchasePage() {
  return (
    <>
      <div className="p-6">
        <h3 className="text-2xl">Purchase Orders</h3>
        <p className="font-light text-gray-500">Manage supplier purchases and inventory restocking</p>
      </div>

      <section className="flex flex-wrap gap-6 w-full px-8 mb-8">
        {/* CARD 1 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <div>
            <CircleCheckBig className="bg-green-100 p-2 rounded-lg text-green-600 h-12 w-11" size={33} />
          </div>

          <div className="p-2">
            <h4 className="text-gray-500 font-light">Total Purchases</h4>
          </div>

          <div className="p-2 text-3xl font-light">
            <p>$9505.00</p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <div>
            <Clock4 className="bg-blue-100 p-2 rounded-lg text-blue-600 h-12 w-11" size={33} />
          </div>

          <div className="p-2">
            <h4 className="text-gray-500 font-light">Total Quantity</h4>
          </div>

          <div className="p-2 text-3xl font-light">
            <p>1700 kg</p>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <div>
            <Package className="bg-orange-100 p-2 rounded-lg text-orange-600 h-12 w-11" size={33} />
          </div>

          <div className="p-2">
            <h4 className="text-gray-500 font-light">Pending Orders</h4>
          </div>

          <div className="p-2 text-3xl font-light">
            <p>1</p>
          </div>
        </div>
      </section>

      {/* Table of Purchases */}
      <div className="mx-8 mt-8 mb-8 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-green-50 font-light text-sm">
            <tr>
              <th className="px-6 py-4">Purchase ID</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {purchase.map((p) => (
              <tr key={p.purchaseId} className="hover:bg-gray-50">
                <td className="px-6 py-5 text-blue-600">{p.purchaseId}</td>
                <td className="px-6 py-5">{p.supplier}</td>
                <td className="px-6 py-5 text-gray-600">{p.date}</td>
                <td className="px-6 py-5">{p.items}</td>
                <td className="px-6 py-5">{p.quantity}</td>
                <td className="px-6 py-5">${p.amount.toFixed(2)}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}