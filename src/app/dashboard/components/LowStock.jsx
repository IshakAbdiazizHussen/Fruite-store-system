import { AlertTriangle } from "lucide-react";

const items = [
  { name: "Avocados", stock: "15 kg", reorder: "50 kg", days: "2 days", status: "Critical" },
  { name: "Strawberries", stock: "25 kg", reorder: "60 kg", days: "3 days", status: "Critical" },
  { name: "Bananas", stock: "30 kg", reorder: "100 kg", days: "4 days", status: "Warning" },
];

export default function LowStockTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold">Low Stock Alerts</h3>
        <p className="text-gray-500 text-sm">
          Items requiring immediate attention
        </p>
      </div>

      {/* TABLE */}
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
          <tr>
            <th className="px-6 py-4">Fruit Name</th>
            <th className="px-6 py-4">Current Stock</th>
            <th className="px-6 py-4">Reorder Level</th>
            <th className="px-6 py-4">Days to Expiry</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.name}
              className={`border-t ${
                item.status === "Critical" ? "bg-red-50" : "bg-orange-50"
              }`}
            >
              <td className="px-6 py-5 font-medium">{item.name}</td>

              <td
                className={`px-6 py-5 font-semibold ${
                  item.status === "Critical"
                    ? "text-red-600"
                    : "text-orange-500"
                }`}
              >
                {item.stock}
              </td>

              <td className="px-6 py-5">{item.reorder}</td>

              <td
                className={`px-6 py-5 flex items-center gap-2 ${
                  item.days.startsWith("2")
                    ? "text-red-600"
                    : "text-orange-500"
                }`}
              >
                {item.days.startsWith("2") && (
                  <AlertTriangle size={16} />
                )}
                {item.days}
              </td>

              <td className="px-6 py-5">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === "Critical"
                      ? "bg-red-100 text-red-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td className="px-6 py-5">
                <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg">
                  Reorder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
