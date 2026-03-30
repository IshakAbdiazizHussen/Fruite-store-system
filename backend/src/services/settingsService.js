const Settings = require("../models/Settings");

function mergeSettings(current, patch) {
  return {
    ...current,
    ...patch,
    profile: {
      ...current.profile,
      ...(patch.profile || {}),
    },
    notifications: {
      ...current.notifications,
      ...(patch.notifications || {}),
    },
    regional: {
      ...current.regional,
      ...(patch.regional || {}),
    },
    security: {
      ...current.security,
      ...(patch.security || {}),
    },
  };
}

async function getSettings() {
  return Settings.findOne({ key: "default" }).lean();
}

async function updateSettings(patch) {
  const current = await Settings.findOne({ key: "default" }).lean();
  const merged = mergeSettings(current, patch);
  return Settings.findOneAndUpdate(
    { key: "default" },
    merged,
    { new: true, runValidators: true }
  ).lean();
}

module.exports = {
  getSettings,
  updateSettings,
};
