const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    tone: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const frontendContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    branding: {
      appName: { type: String, required: true, trim: true },
      sidebarTitle: { type: String, required: true, trim: true },
      sidebarSubtitle: { type: String, required: true, trim: true },
    },
    login: {
      eyebrow: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      heroTitle: { type: String, required: true, trim: true },
      heroDescription: { type: String, required: true, trim: true },
    },
    dashboard: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      quickActionsTitle: { type: String, required: true, trim: true },
      quickActionsSubtitle: { type: String, required: true, trim: true },
      actions: { type: [actionSchema], default: [] },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports =
  mongoose.models.FrontendContent ||
  mongoose.model("FrontendContent", frontendContentSchema);
