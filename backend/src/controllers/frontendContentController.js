const { asyncHandler } = require("./resourceController");
const {
  getFrontendContent,
  updateFrontendContent,
} = require("../services/frontendContentService");

const getFrontendContentController = asyncHandler(async (_req, res) => {
  const content = await getFrontendContent();
  res.status(200).json(content);
});

const updateFrontendContentController = asyncHandler(async (req, res) => {
  const content = await updateFrontendContent(req.body || {});
  res.status(200).json(content);
});

module.exports = {
  getFrontendContent: getFrontendContentController,
  updateFrontendContent: updateFrontendContentController,
};
