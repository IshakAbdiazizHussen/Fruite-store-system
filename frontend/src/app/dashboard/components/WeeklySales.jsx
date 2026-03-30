"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSales } from "@/hooks/useSales";

export default function WeeklySalesChart() {
  const { sales } = useSales();

  const data = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return {
        key: date.toISOString().split("T")[0],
        day: formatter.format(date),
        sales: 0,
      };
    });

    sales.forEach((sale) => {
      const target = days.find((day) => day.key === sale.date);
      if (target) {
        target.sales += Number(sale.total || 0);
      }
    });

    return days.map(({ key, ...item }) => item);
  }, [sales]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900">Weekly Sales</h3>
      <p className="text-sm text-gray-400 mt-0.5 mb-4">Sales performance over the last 7 days</p>
      <div className="h-280 w-full">
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
