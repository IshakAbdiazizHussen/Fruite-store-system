"use client";

import { Bell, Search } from "lucide-react";

export default function Topper() {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3 w-full max-w-md">
        <Search className="text-gray-500" size={18} />
        <input
          className="w-full outline-none"
          placeholder="Search fruits, orders, suppliers..."
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell size={18} />
        <div className="text-right">
          <div className="font-semibold">John Manager</div>
          <div className="text-sm text-gray-500">Store Admin</div>
        </div>
      </div>
    </div>
  );
}
