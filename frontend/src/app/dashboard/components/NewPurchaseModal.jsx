"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function NewPurchaseModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        supplier: "",
        items: "",
        quantity: "",
        amount: "",
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            quantity: `${formData.quantity} kg`,
            amount: Number(formData.amount),
        });
        setFormData({
            supplier: "",
            items: "",
            quantity: "",
            amount: "",
            status: "Pending",
            date: new Date().toISOString().split("T")[0],
        });
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">New Purchase Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input
                            required
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Supplier name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                        <input
                            required
                            name="items"
                            value={formData.items}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g. Apples, Oranges"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                            <input
                                required
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 font-medium shadow-lg shadow-blue-200 transition-all"
                        >
                        Create Purchase
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
