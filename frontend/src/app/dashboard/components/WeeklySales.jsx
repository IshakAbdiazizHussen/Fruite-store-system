"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSales } from "@/hooks/useSales";
import { getInitialTheme, subscribeToTheme } from "@/lib/theme";

export default function WeeklySalesChart() {
  const { sales } = useSales();
  const [theme, setCurrentTheme] = useState("light");

  const data = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const validSaleDates = sales
      .map((sale) => sale.date)
      .filter((date) => typeof date === "string" && !Number.isNaN(new Date(date).getTime()))
      .sort();
    const referenceDate = validSaleDates.length > 0 ? new Date(validSaleDates[validSaleDates.length - 1]) : new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(referenceDate);
      date.setDate(referenceDate.getDate() - (6 - index));
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

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
    return subscribeToTheme(setCurrentTheme);
  }, []);

  const isDark = theme === "dark";
  const tickColor = isDark ? "#94a3b8" : "#64748b";
  const cursorColor = isDark ? "rgba(148, 163, 184, 0.08)" : "#f1f5f9";
  const tooltipStyle = {
    borderRadius: 12,
    border: isDark ? "1px solid rgba(148, 163, 184, 0.16)" : "1px solid #e2e8f0",
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.96)" : "#ffffff",
    color: isDark ? "#f8fafc" : "#0f172a",
    boxShadow: isDark ? "0 16px 36px rgba(2, 6, 23, 0.45)" : "0 12px 30px rgba(15, 23, 42, 0.12)",
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Sales</h3>
      <p className="mt-0.5 mb-4 text-sm text-slate-400 dark:text-slate-500">Sales performance over the last 7 days</p>
      <div className="h-280 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: cursorColor }}
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? "#f8fafc" : "#0f172a", fontWeight: 600 }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]}
            />
            <Legend
              wrapperStyle={{ paddingTop: 12 }}
              formatter={(value) => (
                <span style={{ color: isDark ? "#e2e8f0" : "#334155" }}>
                  {value === "sales" ? "Weekly Sales" : value}
                </span>
              )}
            />
            <Bar name="Weekly Sales" dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
