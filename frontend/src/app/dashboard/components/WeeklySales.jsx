"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1450 },
  { day: "Wed", sales: 1100 },
  { day: "Thu", sales: 1650 },
  { day: "Fri", sales: 1880 },
  { day: "Sat", sales: 2100 },
  { day: "Sun", sales: 1750 },
];

export default function WeeklySalesChart() {
  return (
    <div className="w-full">
      <h3 className="text-[18px] font-medium text-slate-800">Weekly Sales</h3>
      <p className="mt-2 text-[14px] text-slate-500">Sales performance over the last 7 days</p>
      <div className="mt-6 h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 18, bottom: 24, left: 18 }} barCategoryGap="18%">
            <CartesianGrid stroke="#e9eef5" strokeDasharray="4 4" vertical />
            <XAxis
              dataKey="day"
              axisLine={{ stroke: "#a8b3c2" }}
              tickLine={false}
              tick={{ fill: "#98a2b3", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 2200]}
              ticks={[0, 550, 1100, 1650, 2200]}
              axisLine={{ stroke: "#a8b3c2" }}
              tickLine={false}
              tick={{ fill: "#98a2b3", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(31, 187, 132, 0.08)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]}
            />
            <Bar dataKey="sales" fill="#1fbb84" radius={[10, 10, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
