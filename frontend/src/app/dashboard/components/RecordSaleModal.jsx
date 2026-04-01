"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function RecordSaleModal({ isOpen, onClose, onAdd }) {
    const initialFormState = {
        name: "",
        units: "",
        price: "",
        date: new Date().toISOString().split("T")[0],
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await onAdd({
                ...formData,
                units: Number(formData.units),
                price: Number(formData.price),
                total: Number(formData.units) * Number(formData.price),
            });
            setFormData(initialFormState);
            onClose();
        } catch (error) {
            setErrorMessage(error?.message || "Unable to record the sale right now.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                    <h2 className="text-xl font-semibold text-slate-900">Record New Sale</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Fruit Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20" placeholder="e.g. Bananas" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Units Sold</label>
                            <input required type="number" name="units" value={formData.units} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20" placeholder="0" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Price per Unit ($)</label>
                            <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20" placeholder="0.00" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Sale Date</label>
                        <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20" />
                    </div>
                    {errorMessage ? (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </p>
                    ) : null}
                    <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-orange-500 py-3 font-medium text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300 disabled:shadow-none">
                        {isSubmitting ? "Recording..." : "Record Sale"}
                    </button>
                </form>
            </div>
        </div>
    );
}
