"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

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

export default function InventoryPie() {
  return (
    <PieChart width={350} height={300}>
      <Pie data={data} dataKey="value" outerRadius={100} label>
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
