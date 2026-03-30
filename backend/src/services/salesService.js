const Sale = require("../models/Sale");
const SalesAnalytics = require("../models/SalesAnalytics");
const { getNextCode } = require("./idService");

async function listSales() {
  const sales = await Sale.find().sort({ createdAt: -1 }).lean();
  const analyticsDocument = await SalesAnalytics.findOne({ key: "default" }).lean();

  return {
    sales,
    analytics: analyticsDocument?.analytics || [],
  };
}

async function createSale(payload) {
  const saleId = await getNextCode(Sale, "saleId", "SALE");
  const sale = await Sale.create({
    ...payload,
    saleId,
    units: Number(payload.units),
    price: Number(payload.price),
    total: Number(payload.total),
  });

  const month = new Date(payload.date).toLocaleString("default", { month: "short" });
  await SalesAnalytics.updateOne(
    { key: "default", "analytics.month": month },
    {
      $inc: {
        "analytics.$.revenue": Number(payload.total),
        "analytics.$.units": Number(payload.units),
      },
    }
  );

  return sale.toObject();
}

module.exports = {
  createSale,
  listSales,
};
