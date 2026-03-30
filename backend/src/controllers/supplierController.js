const { asyncHandler, createCrudController } = require("./resourceController");
const {
  createSupplier,
  deleteSupplier,
  listSuppliers,
  resetSuppliers,
} = require("../services/supplierService");

const baseController = createCrudController({
  list: listSuppliers,
  create: createSupplier,
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
