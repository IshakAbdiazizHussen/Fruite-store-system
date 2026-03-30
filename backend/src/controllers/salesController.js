const { asyncHandler } = require("./resourceController");
const { createSale, listSales } = require("../services/salesService");

const listSalesController = asyncHandler(async (_req, res) => {
  const data = await listSales();
  res.status(200).json(data);
});

const createSaleController = asyncHandler(async (req, res) => {
  const data = await createSale(req.body || {});
  res.status(201).json(data);
});

module.exports = {
  createSale: createSaleController,
  listSales: listSalesController,
};
