"use client";

import { TrendingUp, Box, AlertTriangle, Clock } from "lucide-react";

const iconMap = {
  sales: { Icon: TrendingUp, bg: "bg-emerald-100", color: "text-emerald-500" },
  inventory: { Icon: Box, bg: "bg-blue-100", color: "text-blue-500" },
  lowstock: { Icon: AlertTriangle, bg: "bg-orange-100", color: "text-orange-500" },
  expiring: { Icon: Clock, bg: "bg-red-100", color: "text-red-500" },
};

const badgeColor = {
  "+12.5%": "text-green-500 dark:text-green-300",
  "+5.2%": "text-blue-500 dark:text-blue-300",
  "Critical": "text-red-500 dark:text-red-300",
  "urgent": "text-red-500 dark:text-red-300",
};

export default function StatCard({ title, value, badge, type = "sales" }) {
  const { Icon, bg, color } = iconMap[type] || iconMap.sales;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${bg} dark:bg-white/10`}>
          <Icon size={20} className={color} />
        </div>
        {badge && (
          <span className={`text-sm font-semibold ${badgeColor[badge] || "text-green-500 dark:text-green-300"}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
        <h2 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</h2>
      </div>
    </div>
  );
}
