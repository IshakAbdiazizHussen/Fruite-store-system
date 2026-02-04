"use client";

import { Bell, Search } from "lucide-react";

  return (
    <div className="flex items-center justify-between bg-white px-6 py-3.5 shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

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
