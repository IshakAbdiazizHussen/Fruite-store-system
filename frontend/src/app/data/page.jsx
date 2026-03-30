// order side
export  const orders = [
  { orderId: "ORD001", customer: "Fresh Market Inc.", date: "2024-11-15", items: 3, total: 45.99, status: "Delivered" },
  { orderId: "ORD002", customer: "Healthy Foods Co.", date: "2024-11-16", items: 2, total: 32.5, status: "Processing" },
  { orderId: "ORD003", customer: "Green Grocery Store", date: "2024-11-17", items: 5, total: 78.25, status: "Pending" },
  { orderId: "ORD004", customer: "Organic Market", date: "2024-11-18", items: 1, total: 15.0, status: "Delivered" },
  { orderId: "ORD005", customer: "City Supermarket", date: "2024-11-19", items: 4, total: 60.75, status: "Processing" },
  { orderId: "ORD006", customer: "Corner Store", date: "2024-11-20", items: 2, total: 28.0, status: "Delivered" },
  { orderId: "ORD007", customer: "Downtown Market", date: "2024-11-21", items: 3, total: 42.5, status: "Pending" },
  { orderId: "ORD008", customer: "Fresh Valley", date: "2024-11-22", items: 6, total: 90.0, status: "Delivered" },
];

// purchase side

export const purchase = [
  { purchaseId: "PUR001", supplier: "Fresh Market Inc.", date: "2024-11-10", items: 100, quantity: 500, amount: 1500.0, status: "Completed" },
  { purchaseId: "PUR002", supplier: "Tropical Imports Ltd", date: "2024-11-12", items: 50, quantity: 300, amount: 900.0, status: "Pending" },
  { purchaseId: "PUR003", supplier: "Berry Best Co.", date: "2024-11-14", items: 80, quantity: 400, amount: 1200.0, status: "Completed" },
  { purchaseId: "PUR004", supplier: "Citrus Valley", date: "2024-11-16", items: 60, quantity: 350, amount: 1050.0, status: "Completed" },
  { purchaseId: "PUR005", supplier: "Farm Fresh Suppliers", date: "2024-11-18", items: 70, quantity: 320, amount: 960.0, status: "Pending" },
];

// sales side

export const reports = [
  { name: "Monthly Sales Report", type: "Sales", date: "2025-12-01", size: "2.4 MB", status: "Ready" },
  { name: "Inventory Status Report", type: "Inventory", date: "2025-12-01", size: "1.8 MB", status: "Ready" },
  { name: "Supplier Performance", type: "Suppliers", date: "2025-11-30", size: "1.2 MB", status: "Ready" },
  { name: "Profit & Loss Statement", type: "Financial", date: "2025-11-30", size: "3.1 MB", status: "Ready" },
  { name: "Stock Movement Report", type: "Inventory", date: "2025-11-28", size: "2.7 MB", status: "Ready" },
  { name: "Customer Orders Summary", type: "Orders", date: "2025-11-28", size: "1.5 MB", status: "Ready" },
];



export const chartData = [
  { month: "Jan", revenue: 43000, units: 12000 },
  { month: "Feb", revenue: 41000, units: 11500 },
  { month: "Mar", revenue: 46000, units: 13000 },
  { month: "Apr", revenue: 50500, units: 14500 },
  { month: "May", revenue: 55000, units: 15800 },
  { month: "Jun", revenue: 56500, units: 16200 },
  { month: "Jul", revenue: 61000, units: 17500 },
  { month: "Aug", revenue: 59000, units: 16800 },
  { month: "Sep", revenue: 64000, units: 18200 },
  { month: "Oct", revenue: 67000, units: 19200 },
  { month: "Nov", revenue: 73000, units: 20500 },
  { month: "Dec", revenue: 80000, units: 22500 },
];

