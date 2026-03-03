const Supplier = require("../models/Supplier");

const suppliers = [];

function getAllSuppliers() {
  return suppliers;
}

function createSupplier(payload) {
  const supplier = new Supplier({
    id: Date.now(),
    ...payload,
  });

  suppliers.push(supplier);
  return supplier;
}

module.exports = {
  getAllSuppliers,
  createSupplier,
};
