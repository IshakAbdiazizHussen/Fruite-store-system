import Sidebar from "./components/Sidebar";
import Topper from "./components/Topper";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen overflow-hidden flex">
      {/* Sidebar fixed */}
      <aside className="w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        {/* Topper fixed */}
        <div className="shrink-0">
          <Topper />
        </div>

        {/* Only this part scrolls */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      
    </div>
  );
}