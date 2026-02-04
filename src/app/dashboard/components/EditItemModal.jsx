"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditItemModal({ isOpen, onClose, onSave, item }) {
    const [formData, setFormData] = useState({
        name: "",
        category: "Apples",
        stock: "",
        unit: "kg",
        price: "",
        expiry: "",
    });

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || "",
                category: item.category || "Apples",
                stock: String(item.stock || ""),
                unit: item.unit || "kg",
                price: String(item.price || ""),
                expiry: item.expiry || "",
            });
        }
    }, [item]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            stock: Number(formData.stock),
            price: Number(formData.price),
            status: Number(formData.stock) < 50 ? "Low Stock" : "In Stock",
        });
        onClose();
    };

    const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm";
    const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Edit Item</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Update inventory item details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className={labelCls}>Fruit Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputCls}
                            placeholder="e.g. Fuji Apples"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                                <option>Apples</option>
                                <option>Tropical</option>
                                <option>Berries</option>
                                <option>Citrus</option>
                                <option>Melons</option>
                                <option>Others</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Unit</label>
                            <select name="unit" value={formData.unit} onChange={handleChange} className={inputCls}>
                                <option>kg</option>
                                <option>pcs</option>
                                <option>box</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Stock Quantity</label>
                            <input
                                required
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className={inputCls}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Price per Unit ($)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={inputCls}
                                placeholder="0.00"
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Expiry Date</label>
                        <input
                            required
                            type="date"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleChange}
                            className={inputCls}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-green-500 text-white hover:bg-green-600 font-medium shadow-lg shadow-green-200 transition-all text-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
