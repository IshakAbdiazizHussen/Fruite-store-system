"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useInventory } from "@/hooks/useInventory";
import { getInitialTheme, subscribeToTheme } from "@/lib/theme";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#ec4899",
  "#14b8a6",
  "#8b5cf6",
];

export default function InventoryPie() {
  const { items } = useInventory();
  const [theme, setCurrentTheme] = useState("light");
  const data = useMemo(() => {
    const grouped = items.reduce((acc, item) => {
      const key = item.category || "Others";
      acc[key] = (acc[key] || 0) + Number(item.stock || 0);
      return acc;
    }, {});

    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);
    if (!total) return [];

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
    }));
  }, [items]);

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
    return subscribeToTheme(setCurrentTheme);
  }, []);

  const isDark = theme === "dark";
  const tooltipStyle = {
    borderRadius: 12,
    border: isDark ? "1px solid rgba(148, 163, 184, 0.16)" : "1px solid #e2e8f0",
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.96)" : "#ffffff",
    color: isDark ? "#f8fafc" : "#0f172a",
    boxShadow: isDark ? "0 16px 36px rgba(2, 6, 23, 0.45)" : "0 12px 30px rgba(15, 23, 42, 0.12)",
  };
  const renderPieLabel = ({ name, value, x, y }) => (
    <text x={x} y={y} fill={isDark ? "#e2e8f0" : "#334155"} fontSize="12" textAnchor="middle" dominantBaseline="central">
      {`${name} ${value}%`}
    </text>
  );

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Inventory by Category</h3>
      <p className="mt-0.5 mb-4 text-sm text-slate-400 dark:text-slate-500">Current stock distribution</p>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={renderPieLabel}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? "#f8fafc" : "#0f172a", fontWeight: 600 }}
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Legend formatter={(value) => <span style={{ color: isDark ? "#e2e8f0" : "#334155" }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
