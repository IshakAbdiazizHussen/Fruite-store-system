"use client";

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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h3 className="text-lg font-semibold text-gray-900">Stock Trends</h3>
      <p className="text-sm text-gray-400 mt-0.5 mb-6">Inventory levels over the past week</p>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 13 }}
              dy={8}
            />
            <YAxis
              domain={[0, 650]}
              ticks={[0, 150, 300, 450, 600]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}
              formatter={(value, name) => [`${value} kg`, name]}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: 20, fontSize: 13 }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: 600 }}>⊙ {value}</span>
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
