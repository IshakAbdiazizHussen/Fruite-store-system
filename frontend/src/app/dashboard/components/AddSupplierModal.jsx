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
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">Add New Supplier</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Company Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="Farm Fresh Co." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Contact Person</label>
                        <input required name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="John Smith" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="+1..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="City, Country" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="supplier@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Products</label>
                        <input required name="products" value={formData.products} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="Apples, Pears, etc." />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                        Add Supplier
                    </button>
                </form>
            </div>
        </div>
    );
}
