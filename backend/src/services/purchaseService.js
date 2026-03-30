const Purchase = require("../models/Purchase");
const { getNextCode } = require("./idService");

async function listPurchases() {
  return Purchase.find().sort({ createdAt: -1 }).lean();
}

async function createPurchase(payload) {
  const purchaseId = await getNextCode(Purchase, "purchaseId", "PUR");
  const purchase = await Purchase.create({
    ...payload,
    purchaseId,
    amount: Number(payload.amount),
  });

  return purchase.toObject();
}

async function updatePurchase(purchaseId, payload) {
  const purchase = await Purchase.findOneAndUpdate(
    { purchaseId },
    {
      ...payload,
      amount: Number(payload.amount),
    },
    { new: true, runValidators: true }
  ).lean();

  if (!purchase) {
    const error = new Error(`Purchase ${purchaseId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return purchase;
}

module.exports = {
  createPurchase,
  listPurchases,
  updatePurchase,
};
