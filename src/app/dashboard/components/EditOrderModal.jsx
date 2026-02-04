"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditOrderModal({ isOpen, onClose, onSave, order }) {
    const [formData, setFormData] = useState({
        customer: "",
        items: "",
        total: "",
        status: "Pending",
        date: "",
    });

    useEffect(() => {
        if (order) {
            setFormData({
                customer: order.customer || "",
                items: String(order.items || ""),
                total: String(order.total || ""),
                status: order.status || "Pending",
                date: order.date || "",
            });
        }
    }, [order]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...order,
            ...formData,
            items: Number(formData.items),
            total: Number(formData.total),
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
                        <h2 className="text-xl font-semibold text-gray-800">Edit Order</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{order?.orderId}</p>
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
                        <label className={labelCls}>Customer Name</label>
                        <input
                            required
                            type="text"
                            name="customer"
                            value={formData.customer}
                            onChange={handleChange}
                            className={inputCls}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Number of Items</label>
                            <input
                                required
                                type="number"
                                name="items"
                                value={formData.items}
                                onChange={handleChange}
                                className={inputCls}
                                min="1"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Total Amount ($)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                name="total"
                                value={formData.total}
                                onChange={handleChange}
                                className={inputCls}
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelCls}>Order Date</label>
                        <input
                            required
                            type="date"
                            name="date"
                            value={formData.date}
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
