"use client";

import React from "react";
import { X, Package, Calendar, Tag, DollarSign, Layers } from "lucide-react";

export default function ViewItemModal({ isOpen, onClose, item }) {
    if (!isOpen || !item) return null;

    const isLow = item.status === "Low Stock";

    const Detail = ({ icon: Icon, label, value, valueClass = "" }) => (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <Icon size={18} className="text-green-600" />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className={`text-sm font-semibold text-gray-800 mt-0.5 ${valueClass}`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-green-200">
                            {item.name?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1
                ${isLow ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Details */}
                <div className="p-6 grid gap-3">
                    <Detail icon={Tag} label="Category" value={item.category} />
                    <Detail icon={Layers} label="Stock" value={`${item.stock} ${item.unit}`} valueClass={isLow ? "text-orange-600" : ""} />
                    <Detail icon={DollarSign} label="Price per Unit" value={`$${Number(item.price).toFixed(2)}`} />
                    <Detail icon={Calendar} label="Expiry Date" value={item.expiry} />
                    <Detail icon={Package} label="Total Value" value={`$${(item.stock * item.price).toFixed(2)}`} valueClass="text-green-700" />
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
