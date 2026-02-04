"use client";

import {
  Package,
  LayoutDashboard,
  Box,
  TrendingUp,
  ShoppingCart,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  Dot,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Inventory", icon: Box },
  { label: "Sales", icon: TrendingUp },
  { label: "Orders", icon: ShoppingCart },
  { label: "Purchases", icon: ShoppingBag },
  { label: "Suppliers", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white flex flex-col">
      {/* LOGO */}
      <div className="px-6 py-8 flex items-center gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-3 rounded-xl shadow-lg">
          <Package className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Fresh Harvest</h1>
          <p className="text-sm text-green-200">Fruits Management</p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-green-600 mx-6 mb-4" />

      {/* MENU */}
      <nav className="flex-1 px-4 space-y-2">

  {/* Dashboard - ACTIVE */}
  <div className="relative flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer bg-gradient-to-r from-orange-400 to-orange-500 text-white">
    <LayoutDashboard size={20} />
    <span className="text-base font-medium">Dashboard</span>
    <Dot className="absolute right-4 text-yellow-200" size={32} />
  </div>

  {/* Inventory */}
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-green-100 hover:bg-green-700">
    <Box size={20} />
    <span className="text-base font-medium">Inventory</span>
  </div>

  {/* Sales */}
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-green-100 hover:bg-green-700">
    <TrendingUp size={20} />
    <span className="text-base font-medium">Sales</span>
  </div>

  {/* Orders */}
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-green-100 hover:bg-green-700">
    <ShoppingCart size={20} />
    <span className="text-base font-medium">Orders</span>
  </div>

  {/* Purchases */}
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-green-100 hover:bg-green-700">
    <ShoppingBag size={20} />
    <span className="text-base font-medium">Purchases</span>
  </div>

  {/* Suppliers */}
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-green-100 hover:bg-green-700">
    <Users size={20} />
    <span className="text-base font-medium">Suppliers</span>
  </div>

  {/* Reports */}
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-green-100 hover:bg-green-700">
    <FileText size={20} />
    <span className="text-base font-medium">Reports</span>
  </div>

  {/* Settings */}
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-green-100 hover:bg-green-700">
    <Settings size={20} />
    <span className="text-base font-medium">Settings</span>
  </div>

</nav>

    </aside>
  );
}
