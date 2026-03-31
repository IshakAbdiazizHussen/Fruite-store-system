"use client";

import React, { useState, useMemo } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Users, Plus } from "lucide-react";
import { ResponsiveContainer, LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useSales } from "@/hooks/useSales";
import RecordSaleModal from "../components/RecordSaleModal";
export default function SalesPage() {
  const { sales, analytics, addSale } = useSales();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + Number(sale.total || 0), 0);
    const totalUnits = sales.reduce((acc, sale) => acc + Number(sale.units || 0), 0);
    return { revenue: totalRevenue, units: totalUnits };
  }, [sales]);

  const topSellingData = useMemo(() => {
    const counts = {};
    sales.forEach((sale) => {
      counts[sale.name] = (counts[sale.name] || 0) + Number(sale.units || 0);
    });
    return Object.entries(counts)
      .map(([name, units]) => ({ name, sales: units }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [sales]);

  return (
    <>
      <div className="p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Sales Analytics</h1>
          <p className="text-gray-600 dark:text-slate-400 font-light">
            Track your sales performance and revenue
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200 dark:shadow-none"
        >
          <Plus size={20} />
          Record Sale
        </button>
      </div>

      <section className="flex flex-wrap gap-6 w-full px-8">
        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 flex-1 min-w-[260px]">
          <section className="flex items-start justify-between">
            <DollarSign className="bg-green-100 p-2 rounded-lg text-green-600 h-12 w-11" size={33} />
            <p className="text-green-600 font-medium">+18.2%</p>
          </section>
          <section className="mt-4">
            <p className="text-gray-500 dark:text-slate-400 text-sm font-light">Total Revenue</p>
            <h3 className="text-3xl font-medium text-slate-900 dark:text-white mt-1">${stats.revenue.toLocaleString()}</h3>
            <p className="text-gray-400 dark:text-slate-500 text-xs mt-2 font-light">Updated just now</p>
          </section>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 flex-1 min-w-[260px]">
          <section className="flex items-start justify-between">
            <ShoppingBag className="bg-blue-100 p-2 rounded-lg text-blue-600 h-12 w-11" size={33} />
            <p className="text-blue-600 font-medium">+12.5%</p>
          </section>
          <section className="mt-4">
            <p className="text-gray-500 dark:text-slate-400 text-sm font-light">Total Sales</p>
            <h3 className="text-3xl font-medium text-slate-900 dark:text-white mt-1">{stats.units.toLocaleString()}</h3>
            <p className="text-gray-400 dark:text-slate-500 text-xs mt-2 font-light">Units sold</p>
          </section>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 flex-1 min-w-[260px]">
          <section className="flex items-start justify-between">
            <TrendingUp className="bg-orange-100 p-2 rounded-lg text-orange-600 h-12 w-11" size={33} />
            <p className="text-orange-600 font-medium">+8.4%</p>
          </section>
          <section className="mt-4">
            <p className="text-gray-500 dark:text-slate-400 text-sm font-light">Average Order</p>
            <h3 className="text-3xl font-medium text-slate-900 dark:text-white mt-1">${(stats.revenue / stats.units || 0).toFixed(2)}</h3>
            <p className="text-gray-400 dark:text-slate-500 text-xs mt-2 font-light">Per transaction</p>
          </section>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 flex-1 min-w-[260px]">
          <section className="flex items-start justify-between">
            <Users className="bg-purple-100 p-2 rounded-lg text-purple-600 h-12 w-11" size={33} />
            <p className="text-purple-600 font-medium">+22.1%</p>
          </section>
          <section className="mt-4">
            <p className="text-gray-500 dark:text-slate-400 text-sm font-light">Customers</p>
            <h3 className="text-3xl font-medium text-slate-900 dark:text-white mt-1">1,847</h3>
            <p className="text-gray-400 dark:text-slate-500 text-xs mt-2 font-light">Active buyers</p>
          </section>
        </div>
      </section>

      <section className="px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 p-6">
          <h3 className="text-xl font-medium text-slate-900 dark:text-white">Monthly Sales Performance</h3>
          <p className="text-gray-500 dark:text-slate-400 font-light mb-6">Revenue and unit distribution by month</p>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: "#f59e0b" }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="units" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: "#10b981" }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-8 mt-8 mb-8 flex gap-6">
        <div className="flex-[1.5] bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 p-6 text-2xl font-light">
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-1">Top Selling Products</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-light mb-6">Best performers this month</p>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="sales" fill="#10b981" radius={[0, 8, 8, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 dark:border-white/10 dark:bg-slate-900/80 p-6 text-2xl font-light">
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-1">Recent Transactions</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-light mb-4">Latest sales activity</p>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {sales.map((s) => (
              <div key={s.saleId || s.id} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <div>
                  <p className="font-medium text-sm text-slate-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{s.date}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-green-600">+${s.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{s.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RecordSaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addSale} />
    </>
  );
}
