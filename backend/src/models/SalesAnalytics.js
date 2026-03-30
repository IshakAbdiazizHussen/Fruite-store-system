const mongoose = require("mongoose");

const salesAnalyticsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    analytics: [
      {
        _id: false,
        month: { type: String, required: true, trim: true },
        revenue: { type: Number, required: true, min: 0 },
        units: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.SalesAnalytics || mongoose.model("SalesAnalytics", salesAnalyticsSchema);
