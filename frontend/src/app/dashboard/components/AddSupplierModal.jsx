"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddSupplierModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        location: "",
        products: "",
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            name: "",
            contactPerson: "",
            phone: "",
            email: "",
            location: "",
            products: "",
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
                    <h2 className="text-xl font-semibold text-gray-800">Add New Supplier</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Farm Fresh Co."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                        <input
                            required
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="John Smith"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="+1..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="supplier@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
                        <input
                            required
                            name="products"
                            value={formData.products}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Apples, Pears, etc."
                        />
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
                            className="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium shadow-lg shadow-green-200 transition-all"
                        >
                            Add Supplier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
