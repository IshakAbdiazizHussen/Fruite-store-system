const { asyncHandler, createCrudController } = require("./resourceController");
const {
  createSupplier,
  deleteSupplier,
  listSuppliers,
  resetSuppliers,
  updateSupplier,
} = require("../services/supplierService");

const baseController = createCrudController({
  list: listSuppliers,
  create: createSupplier,
  update: updateSupplier,
  remove: deleteSupplier,
});

const resetSuppliersController = asyncHandler(async (_req, res) => {
  const suppliers = await resetSuppliers();
  res.status(200).json(suppliers);
});

module.exports = {
  ...baseController,
  resetSuppliers: resetSuppliersController,
};
