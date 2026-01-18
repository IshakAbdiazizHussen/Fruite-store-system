"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";

const data = [
  { day: "Mon", apples: 450, bananas: 360, berries: 210 },
  { day: "Tue", apples: 420, bananas: 340, berries: 195 },
  { day: "Wed", apples: 390, bananas: 320, berries: 180 },
  { day: "Thu", apples: 360, bananas: 295, berries: 160 },
  { day: "Fri", apples: 330, bananas: 270, berries: 145 },
  { day: "Sat", apples: 300, bananas: 245, berries: 130 },
  { day: "Sun", apples: 275, bananas: 220, berries: 115 },
];

export default function StockTrend() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold">Stock Trends</h3>
      <p className="text-gray-500 mb-4">
        Inventory levels over the past week
      </p>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="apples"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="bananas"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="berries"
              stroke="#ec4899"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
