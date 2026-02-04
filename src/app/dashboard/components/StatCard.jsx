"use client";

import { TrendingUp, Box, AlertTriangle, Clock } from "lucide-react";

const iconMap = {
  sales: { Icon: TrendingUp, bg: "bg-emerald-100", color: "text-emerald-500" },
  inventory: { Icon: Box, bg: "bg-blue-100", color: "text-blue-500" },
  lowstock: { Icon: AlertTriangle, bg: "bg-orange-100", color: "text-orange-500" },
  expiring: { Icon: Clock, bg: "bg-red-100", color: "text-red-500" },
};

const badgeColor = {
  "+12.5%": "text-green-500",
  "+5.2%": "text-blue-500",
  "Critical": "text-red-500",
  "urgent": "text-red-500",
};

export default function StatCard({ title, value, badge, type = "sales" }) {
  const { Icon, bg, color } = iconMap[type] || iconMap.sales;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${bg}`}>
          <Icon size={20} className={color} />
        </div>
        {badge && (
          <span className={`text-sm font-semibold ${badgeColor[badge] || "text-green-500"}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-gray-900 mt-1">{value}</h2>
      </div>
    </div>
  );
}
