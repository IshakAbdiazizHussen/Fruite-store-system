"use client";

import React from "react";
import { X, Hash, User, Calendar, Package, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ViewOrderModal({ isOpen, onClose, order }) {
    if (!isOpen || !order) return null;

    const isDelivered = order.status === "Delivered";
    const isProcessing = order.status === "Processing";

    const statusClass = isDelivered
        ? "bg-green-100 text-green-700"
        : isProcessing
            ? "bg-blue-100 text-blue-700"
            : "bg-orange-100 text-orange-700";

    const Detail = ({ icon: Icon, label, value }) => (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <Icon size={18} className="text-green-600" />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1.5", statusClass)}>
                            {order.status}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 grid gap-3">
                    <Detail icon={Hash} label="Order ID" value={order.orderId} />
                    <Detail icon={User} label="Customer" value={order.customer} />
                    <Detail icon={Calendar} label="Order Date" value={order.date} />
                    <Detail icon={Package} label="Items" value={`${order.items} item(s)`} />
                    <Detail icon={DollarSign} label="Total Amount" value={`$${Number(order.total).toFixed(2)}`} />
                </div>

                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
