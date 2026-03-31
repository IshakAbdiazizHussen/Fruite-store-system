const defaultInventory = [
  { name: "Red Apples", category: "Apples", stock: 450, unit: "kg", price: 3.5, expiry: "2025-12-20", status: "In Stock" },
  { name: "Bananas", category: "Tropical", stock: 320, unit: "kg", price: 2.2, expiry: "2025-12-18", status: "In Stock" },
  { name: "Strawberries", category: "Berries", stock: 25, unit: "kg", price: 8.5, expiry: "2025-12-15", status: "Low Stock" },
  { name: "Oranges", category: "Citrus", stock: 380, unit: "kg", price: 3.2, expiry: "2025-12-22", status: "In Stock" },
  { name: "Avocados", category: "Tropical", stock: 15, unit: "kg", price: 6.8, expiry: "2025-12-14", status: "Low Stock" },
  { name: "Blueberries", category: "Berries", stock: 18, unit: "kg", price: 9.0, expiry: "2025-12-19", status: "In Stock" },
  { name: "Mangose", category: "Tropical", stock: 50, unit: "kg", price: 7.5, expiry: "2025-12-21", status: "In Stock" },
  { name: "Grapes", category: "Berries", stock: 60, unit: "kg", price: 4.5, expiry: "2025-12-17", status: "In Stock" },
  { name: "Pineapples", category: "Tropical", stock: 22, unit: "kg", price: 5.0, expiry: "2025-12-16", status: "Low Stock" },
  { name: "Raspberries", category: "Berries", stock: 30, unit: "kg", price: 10.0, expiry: "2025-12-23", status: "In Stock" },
  { name: "Lemons", category: "Citrus", stock: 200, unit: "kg", price: 2.8, expiry: "2025-12-24", status: "In Stock" },
  { name: "Watermelons", category: "Melons", stock: 80, unit: "kg", price: 3.0, expiry: "2025-12-25", status: "In Stock" },
];

const defaultOrders = [
  { orderId: "ORD001", customer: "Fresh Market Inc.", date: "2024-11-15", items: 3, total: 45.99, status: "Delivered" },
  { orderId: "ORD002", customer: "Healthy Foods Co.", date: "2024-11-16", items: 2, total: 32.5, status: "Processing" },
  { orderId: "ORD003", customer: "Green Grocery Store", date: "2024-11-17", items: 5, total: 78.25, status: "Pending" },
  { orderId: "ORD004", customer: "Organic Market", date: "2024-11-18", items: 1, total: 15.0, status: "Delivered" },
  { orderId: "ORD005", customer: "City Supermarket", date: "2024-11-19", items: 4, total: 60.75, status: "Processing" },
  { orderId: "ORD006", customer: "Corner Store", date: "2024-11-20", items: 2, total: 28.0, status: "Delivered" },
  { orderId: "ORD007", customer: "Downtown Market", date: "2024-11-21", items: 3, total: 42.5, status: "Pending" },
  { orderId: "ORD008", customer: "Fresh Valley", date: "2024-11-22", items: 6, total: 90.0, status: "Delivered" },
];

const defaultPurchases = [
  { purchaseId: "PUR001", supplier: "Fresh Market Inc.", date: "2024-11-10", items: 100, quantity: 500, amount: 1500.0, status: "Completed" },
  { purchaseId: "PUR002", supplier: "Tropical Imports Ltd", date: "2024-11-12", items: 50, quantity: 300, amount: 900.0, status: "Pending" },
  { purchaseId: "PUR003", supplier: "Berry Best Co.", date: "2024-11-14", items: 80, quantity: 400, amount: 1200.0, status: "Completed" },
  { purchaseId: "PUR004", supplier: "Citrus Valley", date: "2024-11-16", items: 60, quantity: 350, amount: 1050.0, status: "Completed" },
  { purchaseId: "PUR005", supplier: "Farm Fresh Suppliers", date: "2024-11-18", items: 70, quantity: 320, amount: 960.0, status: "Pending" },
];

const defaultSales = [
  { saleId: "SALE001", name: "Apples", units: 120, price: 3.5, total: 420.0, date: "2024-11-20" },
  { saleId: "SALE002", name: "Bananas", units: 85, price: 2.2, total: 187.0, date: "2024-11-19" },
  { saleId: "SALE003", name: "Strawberries", units: 30, price: 8.5, total: 255.0, date: "2024-11-19" },
  { saleId: "SALE004", name: "Oranges", units: 150, price: 3.2, total: 480.0, date: "2024-11-18" },
];

const defaultAnalytics = [
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

const defaultSuppliers = [
  { supplierId: "SUP001", name: "Farm Fresh Suppliers", contactPerson: "Khaalid Hashi", phone: "+252 61 213 7065", email: "khaalid@farmfresh.com", location: "Mogadishu, Somalia", products: "Apples, Bananas, Grapes", rating: 4.8, orders: 45, color: "bg-green-500" },
  { supplierId: "SUP002", name: "Tropical Imports Ltd", contactPerson: "Mohamed Abdiaziz", phone: "+252 61 090 9070", email: "Azhari@tropicalimports.com", location: "Doha, Qatar", products: "Mangoes, Pineapples, Avocados", rating: 4.9, orders: 38, color: "bg-blue-500" },
  { supplierId: "SUP003", name: "Berry Best Co.", contactPerson: "Khadiijo Hashi", phone: "+252 61 040 6889", email: "khadiijo@berrybest.com", location: "Dubai, UAE", products: "Strawberries, Blueberries", rating: 4.9, orders: 38, color: "bg-purple-500" },
];

const defaultSettings = {
  profile: {
    name: "Ilwaad Mohamed",
    email: "ilwaad@admin.com",
    role: "Administrator",
    avatar: "/Ilwaad-manager.png",
  },
  notifications: {
    email: true,
    push: true,
    lowStock: true,
    expiry: true,
  },
  notificationEmail: "ishakabdiaziz9060@gmail.com",
  regional: {
    language: "en-us",
    currency: "usd",
  },
  security: {
    password: "admin12345",
    lastChanged: null,
    loginAlerts: true,
    rememberDevice: true,
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 30,
  },
};

const defaultFrontendContent = {
  branding: {
    appName: "Fruit Store CMS",
    sidebarTitle: "Fresh Harvest",
    sidebarSubtitle: "Fruits Management",
  },
  login: {
    eyebrow: "Admin Login",
    title: "Sign in to CMS",
    subtitle: "Use the admin email and password you configured in `backend/.env`.",
    heroTitle: "Control your store from one secure dashboard.",
    heroDescription: "Inventory, orders, purchases, suppliers, reports, and settings now run through your backend.",
  },
  dashboard: {
    title: "Dashboard Overview",
    subtitle: "Real-time performance metrics for your fruit store",
    quickActionsTitle: "Quick Actions",
    quickActionsSubtitle: "Run common operations directly from dashboard",
    actions: [
      { label: "Manage Inventory", href: "/dashboard/inventory", tone: "neutral" },
      { label: "Create Purchase", href: "/dashboard/purchases", tone: "success" },
      { label: "Manage Orders", href: "/dashboard/orders", tone: "info" },
    ],
  },
};

module.exports = {
  defaultAnalytics,
  defaultFrontendContent,
  defaultInventory,
  defaultOrders,
  defaultPurchases,
  defaultSales,
  defaultSettings,
  defaultSuppliers,
};
