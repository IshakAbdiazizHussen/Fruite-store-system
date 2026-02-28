"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1450 },
  { day: "Wed", sales: 1100 },
  { day: "Thu", sales: 1600 },
  { day: "Fri", sales: 1850 },
  { day: "Sat", sales: 2100 },
  { day: "Sun", sales: 1700 },
];

export default function WeeklySalesChart() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900">Weekly Sales</h3>
      <p className="text-sm text-gray-400 mt-0.5 mb-4">Sales performance over the last 7 days</p>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]} />
            <Legend formatter={(value) => (value === "sales" ? "Weekly Sales" : value)} />
            <Bar name="Weekly Sales" dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
