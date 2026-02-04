"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topper from "./components/Topper";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen overflow-hidden flex">
      {/* Sidebar fixed */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-0"} shrink-0 overflow-hidden transition-all duration-300`}>
        <Sidebar />
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        {/* Topper fixed */}
        <div className="shrink-0">
          <Topper
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
        </div>

        {/* Only this part scrolls */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      
    </div>
  );
}
