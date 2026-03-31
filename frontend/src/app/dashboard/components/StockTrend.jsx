"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getInitialTheme, subscribeToTheme } from "@/lib/theme";

// Matches the Figma stock trend data
const data = [
  { day: "Mon", Apples: 450, Bananas: 380, Berries: 205 },
  { day: "Tue", Apples: 420, Bananas: 355, Berries: 185 },
  { day: "Wed", Apples: 390, Bananas: 325, Berries: 165 },
  { day: "Thu", Apples: 355, Bananas: 295, Berries: 148 },
  { day: "Fri", Apples: 325, Bananas: 268, Berries: 130 },
  { day: "Sat", Apples: 295, Bananas: 242, Berries: 112 },
  { day: "Sun", Apples: 270, Bananas: 218, Berries: 95 },
];

export default function StockTrend() {
  const [theme, setCurrentTheme] = useState("light");

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
    return subscribeToTheme(setCurrentTheme);
  }, []);

  const isDark = theme === "dark";
  const tickColor = isDark ? "#94a3b8" : "#94a3b8";
  const gridColor = isDark ? "rgba(148, 163, 184, 0.14)" : "#f1f5f9";
  const tooltipStyle = {
    borderRadius: 12,
    border: isDark ? "1px solid rgba(148, 163, 184, 0.16)" : "none",
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.96)" : "#ffffff",
    color: isDark ? "#f8fafc" : "#0f172a",
    boxShadow: isDark ? "0 16px 36px rgba(2, 6, 23, 0.45)" : "0 4px 24px rgba(0,0,0,0.1)",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Stock Trends</h3>
      <p className="mt-0.5 mb-6 text-sm text-slate-400 dark:text-slate-500">Inventory levels over the past week</p>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 13 }}
              dy={8}
            />
            <YAxis
              domain={[0, 650]}
              ticks={[0, 150, 300, 450, 600]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? "#f8fafc" : "#0f172a", fontWeight: 600 }}
              formatter={(value, name) => [`${value} kg`, name]}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: 20, fontSize: 13 }}
              formatter={(value, entry) => (
                <span style={{ color: isDark ? "#e2e8f0" : entry.color, fontWeight: 600 }}>⊙ {value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="Apples"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4, fill: "#ffffff", stroke: "#ef4444", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Bananas"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4, fill: "#ffffff", stroke: "#f59e0b", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Berries"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ r: 4, fill: "#ffffff", stroke: "#ec4899", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
