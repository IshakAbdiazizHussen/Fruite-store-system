const Supplier = require("../models/Supplier");
const { getNextCode } = require("./idService");
const { resetSuppliersToDefaults } = require("./seedService");

async function listSuppliers() {
  const suppliers = await Supplier.find().sort({ createdAt: -1 }).lean();
  return suppliers.map((supplier, index) => ({
    ...supplier,
    id: index + 1,
  }));
}

async function createSupplier(payload) {
  const supplierId = await getNextCode(Supplier, "supplierId", "SUP");
  const supplier = await Supplier.create({
    ...payload,
    supplierId,
    rating: 5.0,
    orders: 0,
    color: "bg-orange-500",
  });

  return supplier.toObject();
}

async function deleteSupplier(identifier) {
  let supplier = await Supplier.findOneAndDelete({ supplierId: identifier });

  if (!supplier && /^\d+$/.test(String(identifier))) {
    const suppliers = await Supplier.find().sort({ createdAt: -1 }).lean();
    const target = suppliers[Number(identifier) - 1];
    if (target) {
      supplier = await Supplier.findOneAndDelete({ supplierId: target.supplierId });
    }
  }

  if (!supplier) {
    const error = new Error(`Supplier ${identifier} not found.`);
    error.statusCode = 404;
    throw error;
  }
}

async function resetSuppliers() {
  const suppliers = await resetSuppliersToDefaults();
  return suppliers.map((supplier, index) => ({
    ...supplier,
    id: index + 1,
  }));
}

module.exports = {
  createSupplier,
  deleteSupplier,
  listSuppliers,
  resetSuppliers,
};
