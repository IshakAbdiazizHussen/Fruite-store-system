"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1450 },
  { day: "Wed", sales: 1100 },
  { day: "Thu", sales: 1600 },
  { day: "Fri", sales: 1850 },
  { day: "Sat", sales: 2100 },
  { day: "Sun", sales: 1700 },
];

export default function WeeklySales() {
  return (
    <BarChart width={450} height={300} data={data}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
    </BarChart>
  );
}
