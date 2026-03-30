const InventoryItem = require("../models/InventoryItem");
const AdminUser = require("../models/AdminUser");
const Order = require("../models/Order");
const Purchase = require("../models/Purchase");
const Sale = require("../models/Sale");
const SalesAnalytics = require("../models/SalesAnalytics");
const Settings = require("../models/Settings");
const Supplier = require("../models/Supplier");
const {
  defaultAnalytics,
  defaultInventory,
  defaultOrders,
  defaultPurchases,
  defaultSales,
  defaultSettings,
  defaultSuppliers,
} = require("../data/defaults");
const { hashPassword } = require("../utils/password");

async function seedCollectionIfEmpty(Model, documents) {
  const count = await Model.countDocuments();
  if (count === 0) {
    await Model.insertMany(documents);
  }
}

async function ensureSeedData() {
  await seedCollectionIfEmpty(InventoryItem, defaultInventory);
  await seedCollectionIfEmpty(Order, defaultOrders);
  await seedCollectionIfEmpty(Purchase, defaultPurchases);
  await seedCollectionIfEmpty(Sale, defaultSales);
  await seedCollectionIfEmpty(Supplier, defaultSuppliers);

  if ((await SalesAnalytics.countDocuments()) === 0) {
    await SalesAnalytics.create({
      key: "default",
      analytics: defaultAnalytics,
    });
  }

  if ((await Settings.countDocuments()) === 0) {
    await Settings.create({
      key: "default",
      ...defaultSettings,
    });
  }

  if ((await AdminUser.countDocuments()) === 0) {
    await AdminUser.create({
      name: process.env.ADMIN_NAME || "Fruit Store Admin",
      email: (process.env.ADMIN_EMAIL || "admin@fruitstore.com").toLowerCase(),
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "admin12345"),
      role: "Administrator",
      isActive: true,
    });
  }
}

async function resetSuppliersToDefaults() {
  await Supplier.deleteMany({});
  await Supplier.insertMany(defaultSuppliers);
  return Supplier.find().sort({ createdAt: -1 }).lean();
}

module.exports = {
  ensureSeedData,
  resetSuppliersToDefaults,
};
