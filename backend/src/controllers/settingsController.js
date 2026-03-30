const { asyncHandler } = require("./resourceController");
const { getSettings, updateSettings } = require("../services/settingsService");

const getSettingsController = asyncHandler(async (_req, res) => {
  const settings = await getSettings();
  res.status(200).json(settings);
});

const updateSettingsController = asyncHandler(async (req, res) => {
  const settings = await updateSettings(req.body || {});
  res.status(200).json(settings);
});

module.exports = {
  getSettings: getSettingsController,
  updateSettings: updateSettingsController,
};
