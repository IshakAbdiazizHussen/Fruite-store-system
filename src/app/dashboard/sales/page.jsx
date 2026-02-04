"use client";

import React from "react";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { chartData } from "@/app/data/page";


const data = [
{ name: "Bananas", sales: 11000 },
{ name: "Apples", sales: 16000 },
{ name: "Oranges", sales: 12500 },
{ name: "Blueberries", sales: 20000 },
{ name: "Grapes", sales: 17500 },
];

export default function SalesPage() {
  return (
    <>
      <div className="p-6">
        <h4 className="text-2xl">Sales Analytics</h4>
        <p className="text-gray-600 font-light">
          Track your sales performance and revenue
        </p>
      </div>

      <section className="flex flex-wrap gap-6 w-full px-8">
        {/* CARD 1 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <section className="flex items-start justify-between">
            <div>
              <DollarSign
                className="bg-green-100 p-2 rounded-lg text-green-600 h-12 w-11"
                size={33}
              />
            </div>
            <div>
              <p className="text-green-600">+18.2%</p>
            </div>
          </section>

          <section className="mt-4">
            <p className="text-gray-500 mt-2 font-light">Total Revenue</p>
            <h3 className="text-3xl mt-2">$78,050</h3>
            <p className="text-gray-500 mt-2 font-light">December 2025</p>
          </section>
        </div>

        {/* CARD 2 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <section className="flex items-start justify-between">
            <div>
              <ShoppingBag
                className="bg-blue-100 p-2 rounded-lg text-blue-600 h-12 w-11"
                size={33}
              />
            </div>
            <div>
              <p className="text-blue-600">+12.5%</p>
            </div>
          </section>

          <section className="mt-4">
            <p className="text-gray-500 mt-2 font-light">Total Sales</p>
            <h3 className="text-3xl mt-2">22,300</h3>
            <p className="text-gray-500 mt-2 font-light">Units sold</p>
          </section>
        </div>

        {/* CARD 3 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <section className="flex items-start justify-between">
            <div>
              <TrendingUp
                className="bg-orange-100 p-2 rounded-lg text-orange-600 h-12 w-11"
                size={33}
              />
            </div>
            <div>
              <p className="text-orange-600">+8.4%</p>
            </div>
          </section>

          <section className="mt-4">
            <p className="text-gray-500 mt-2 font-light">Average Order</p>
            <h3 className="text-3xl mt-2">$3.50</h3>
            <p className="text-gray-500 mt-2 font-light">Per transaction</p>
          </section>
        </div>

        {/* CARD 4 */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex-1 min-w-[260px]">
          <section className="flex items-start justify-between">
            <div>
              <Users
                className="bg-purple-100 p-2 rounded-lg text-purple-600 h-12 w-11"
                size={33}
              />
            </div>
            <div>
              <p className="text-purple-600">+22.1%</p>
            </div>
          </section>

          <section className="mt-4">
            <p className="text-gray-500 mt-2 font-light">Customers</p>
            <h3 className="text-3xl mt-2">1,847</h3>
            <p className="text-gray-500 mt-2 font-light">Active buyers</p>
          </section>
        </div>
      </section>

      {/* CHART (Monthly Sales & Revenue) */}
      <section className="px-8 mt-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-xl">Monthly Sales Revenue</h3>
          <p className="text-gray-600 font-light">Year-over-year performance</p>

          <div className="h-[420px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />

                <Line
                  type="monotone"
                  dataKey="units"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="px-8 mt-8 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-2xl">Top Selling Products</h3>
        <p className="text-gray-600 font-light">Best Perfomers this month</p>

        <div className="h-[420px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={90} />
        <Tooltip />
        <Bar dataKey="sales" fill="#10b981" radius={[10, 10, 10, 10]} />
        </BarChart>
        </ResponsiveContainer>
        </div>
        </div>
    </section>

    </>
  );
}