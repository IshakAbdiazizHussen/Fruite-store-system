"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Apples", value: 28, color: "#f94144" },
  { name: "Bananas", value: 22, color: "#f59e0b" },
  { name: "Citrus", value: 18, color: "#f5b700" },
  { name: "Berries", value: 15, color: "#e63e97" },
  { name: "Tropical", value: 10, color: "#22b8b0" },
  { name: "Others", value: 7, color: "#7c5cff" },
];

function renderLabel({ cx, cy, midAngle, outerRadius, name, value, index }) {
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
  const isRightSide = x >= cx;

  return (
    <text
      x={x}
      y={y}
      fill={data[index].color}
      fontSize="12"
      fontWeight="500"
      textAnchor={isRightSide ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name} ${value}%`}
    </text>
  );
}

export default function InventoryPie() {
  return (
    <div className="w-full">
      <h3 className="text-[18px] font-medium text-slate-800">Inventory by Category</h3>
      <p className="mt-2 text-[14px] text-slate-500">Distribution of fruit categories in stock</p>
      <div className="mt-4 h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 18, right: 44, bottom: 52, left: 44 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={102}
              stroke="#ffffff"
              strokeWidth={1}
              labelLine={false}
              label={renderLabel}
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="square"
              iconSize={10}
              wrapperStyle={{ paddingTop: 20, fontSize: 12 }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: 500 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
