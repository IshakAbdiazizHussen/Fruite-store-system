"use client";

import React from "react";
import { X, Hash, Building2, Calendar, Package, DollarSign, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ViewPurchaseModal({ isOpen, onClose, purchase }) {
    if (!isOpen || !purchase) return null;

    const isDone = purchase.status === "Completed";

    const Detail = ({ icon: Icon, label, value }) => (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <Icon size={18} className="text-blue-600" />
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
                        <h2 className="text-xl font-bold text-gray-900">Purchase Details</h2>
                        <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1.5",
                            isDone ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        )}>
                            {purchase.status}
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
                    <Detail icon={Hash} label="Purchase ID" value={purchase.purchaseId} />
                    <Detail icon={Building2} label="Supplier" value={purchase.supplier} />
                    <Detail icon={Calendar} label="Date" value={purchase.date} />
                    <Detail icon={Package} label="Items" value={`${purchase.items} types`} />
                    <Detail icon={Layers} label="Quantity" value={`${purchase.quantity} kg`} />
                    <Detail icon={DollarSign} label="Total Amount" value={`$${Number(purchase.amount).toFixed(2)}`} />
                </div>
                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
