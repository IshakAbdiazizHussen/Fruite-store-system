const FrontendContent = require("../models/FrontendContent");
const { defaultFrontendContent } = require("../data/defaults");

function mergeFrontendContent(current, patch) {
  return {
    ...defaultFrontendContent,
    ...current,
    ...patch,
    branding: {
      ...defaultFrontendContent.branding,
      ...(current?.branding || {}),
      ...(patch?.branding || {}),
    },
    login: {
      ...defaultFrontendContent.login,
      ...(current?.login || {}),
      ...(patch?.login || {}),
    },
    dashboard: {
      ...defaultFrontendContent.dashboard,
      ...(current?.dashboard || {}),
      ...(patch?.dashboard || {}),
      actions: Array.isArray(patch?.dashboard?.actions)
        ? patch.dashboard.actions
        : current?.dashboard?.actions || defaultFrontendContent.dashboard.actions,
    },
  };
}

async function getFrontendContent() {
  return FrontendContent.findOne({ key: "default" }).lean();
}

async function updateFrontendContent(patch) {
  const current = await FrontendContent.findOne({ key: "default" }).lean();
  const next = mergeFrontendContent(current, patch);

  return FrontendContent.findOneAndUpdate(
    { key: "default" },
    { key: "default", ...next },
    { new: true, runValidators: true }
  ).lean();
}

module.exports = {
  getFrontendContent,
  updateFrontendContent,
};
