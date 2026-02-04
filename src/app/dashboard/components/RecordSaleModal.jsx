"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function RecordSaleModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: "",
        units: "",
        price: "",
        date: new Date().toISOString().split("T")[0],
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            units: Number(formData.units),
            price: Number(formData.price),
            total: Number(formData.units) * Number(formData.price),
        });
        setFormData({
            name: "",
            units: "",
            price: "",
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
                    <h2 className="text-xl font-semibold">Record New Sale</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Fruit Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Bananas" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Units Sold</label>
                            <input required type="number" name="units" value={formData.units} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price per Unit ($)</label>
                            <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="0.00" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sale Date</label>
                        <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                        Record Sale
                    </button>
                </form>
            </div>
        </div>
    );
}
