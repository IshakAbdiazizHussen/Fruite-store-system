import React from "react";
import { CircleCheckBig, Clock4, Package } from "lucide-react";
import { orders } from "@/app/data/page";


function StatusBadge({ status }) {
  const isDelivered = status === "Delivered";
  const isProcessing = status === "Processing";
  const isPending = status === "Pending";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-light
        ${
          isDelivered ? "bg-green-100 text-green-700" : isProcessing ? "bg-blue-100 text-blue-700" : isPending
            ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700" }`} >
      {status}
    </span>
  );
}

export default function OrderPage() {
  return (
    <>
      <section>
        <div className="flex">
          <div className="p-6">
            <h3 className="text-2xl">Orders Management</h3>
            <p className="font-light text-gray-500">Track and manage customer orders</p>
          </div>

          <div className="flex justify-around items-center ml-auto mr-10 mt-5">
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg">
              Create New Order
            </button>
          </div>
        </div>

        <div>
          <section className="flex flex-wrap gap-6 w-full px-8">
            {/* CARD 1 */}
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
              <section className="flex items-start justify-between">
                <div>
                  <CircleCheckBig className="bg-green-100 p-2 rounded-lg text-green-600 h-12 w-11" size={33} />
                </div>
                <div className="mr-37 p-2">
                  <p className="font-light text-gray-500">Delivered</p>
                </div>
              </section>

              <section className="p-2 text-3xl font-light">
                <p>4</p>
              </section>
            </div>

            {/* CARD 2 */}
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
              <section className="flex items-start justify-between">
                <div>
                  <Clock4 className="bg-blue-100 p-2 rounded-lg text-blue-600 h-12 w-11" size={33} />
                </div>
                <div className="mr-37 p-2">
                  <p className="font-light text-gray-500">Processing</p>
                </div>
              </section>

              <section className="p-2 text-3xl font-light">
                <p>2</p>
              </section>
            </div>

            {/* CARD 3 */}
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
              <section className="flex items-start justify-between">
                <div>
                  <Package className="bg-orange-100 p-2 rounded-lg text-orange-600 h-12 w-11" size={33} />
                </div>
                <div className="mr-37 p-2">
                  <p className="font-light text-gray-500">Pending</p>
                </div>
              </section>

              <section className="p-2 text-3xl font-light">
                <p>1</p>
              </section>
            </div>

            {/* CARD 4 */}
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
              <section className="flex items-start justify-between">
                <div>
                  <Package className="bg-gray-100 p-2 rounded-lg text-gray-600 h-12 w-11" size={33} />
                </div>
                <div className="mr-28 p-2">
                  <p className="font-light text-gray-500">Total Orders</p>
                </div>
              </section>

              <section className="p-2 text-3xl font-light">
                <p>8</p>
              </section>
            </div>
          </section>
        </div>
      </section>

      {/* Table Sections */}
      <div className="mx-8 mt-8 mb-8 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-green-50 font-light text-sm">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.orderId} className="hover:bg-gray-50">
                <td className="px-6 py-5 text-blue-600">{o.orderId}</td>
                <td className="px-6 py-5">{o.customer}</td>
                <td className="px-6 py-5 text-gray-600">{o.date}</td>
                <td className="px-6 py-5">{o.items}</td>
                <td className="px-6 py-5">${o.total.toFixed(2)}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-6 py-5">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-light">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}