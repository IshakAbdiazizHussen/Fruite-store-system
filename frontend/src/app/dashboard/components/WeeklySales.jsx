"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getInitialTheme, subscribeToTheme } from "@/lib/theme";

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
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);

    return subscribeToTheme((nextTheme) => {
      setTheme(nextTheme);
    });
  }, []);

  const isDark = theme === "dark";
  const axisTickColor = isDark ? "#cbd5e1" : "#98a2b3";
  const axisLineColor = isDark ? "#64748b" : "#a8b3c2";
  const gridColor = isDark ? "rgba(148, 163, 184, 0.35)" : "#e9eef5";
  const tooltipStyle = {
    borderRadius: 12,
    border: isDark ? "1px solid rgba(148, 163, 184, 0.28)" : "1px solid #e2e8f0",
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    color: isDark ? "#e2e8f0" : "#0f172a",
    boxShadow: isDark
      ? "0 12px 30px rgba(0, 0, 0, 0.35)"
      : "0 12px 30px rgba(15, 23, 42, 0.12)",
  };

  return (
    <div className="w-full">
      <h3 className="text-[18px] font-medium text-slate-800 dark:text-slate-100">Weekly Sales</h3>
      <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-300">Sales performance over the last 7 days</p>
      <div className="mt-6 h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 18, bottom: 24, left: 18 }} barCategoryGap="18%">
            <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical />
            <XAxis
              dataKey="day"
              axisLine={{ stroke: axisLineColor }}
              tickLine={false}
              tick={{ fill: axisTickColor, fontSize: 12 }}
            />
            <YAxis
              domain={[0, 2200]}
              ticks={[0, 550, 1100, 1650, 2200]}
              axisLine={{ stroke: axisLineColor }}
              tickLine={false}
              tick={{ fill: axisTickColor, fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(31, 187, 132, 0.08)" }}
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? "#f8fafc" : "#0f172a", fontWeight: 600 }}
              itemStyle={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]}
            />
            <Bar dataKey="sales" fill="#1fbb84" radius={[10, 10, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
