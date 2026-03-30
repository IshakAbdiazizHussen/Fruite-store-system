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
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">New Purchase Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Supplier</label>
                        <input required name="supplier" value={formData.supplier} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Supplier name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Items</label>
                        <input required name="items" value={formData.items} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Apples, Oranges" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                            <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount ($)</label>
                            <input required type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">
                        Create Purchase
                    </button>
                </form>
            </div>
        </div>
    );
}
