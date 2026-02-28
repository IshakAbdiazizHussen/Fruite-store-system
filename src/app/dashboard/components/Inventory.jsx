"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Apples", value: 28 },
  { name: "Bananas", value: 22 },
  { name: "Citrus", value: 18 },
  { name: "Berries", value: 15 },
  { name: "Tropical", value: 10 },
  { name: "Others", value: 7 },
];

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#ec4899",
  "#14b8a6",
  "#8b5cf6",
];

const renderPieLabel = ({ name, value }) => `${name} ${value}%`;

export default function InventoryPie() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900">Inventory by Category</h3>
      <p className="text-sm text-gray-400 mt-0.5 mb-4">Current stock distribution</p>
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
            <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            <Legend formatter={(value) => value} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
