const FrontendContent = require("../models/FrontendContent");
const { defaultFrontendContent } = require("../data/defaults");
const { getCache, invalidateCache, setCache } = require("./cacheService");

const FRONTEND_CONTENT_CACHE_KEY = "frontend-content";
const FRONTEND_CONTENT_CACHE_TTL_MS = 60 * 1000;

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
  const cached = getCache(FRONTEND_CONTENT_CACHE_KEY);
  if (cached) {
    return cached;
  }

  const content = await FrontendContent.findOne({ key: "default" }).lean();
  return setCache(FRONTEND_CONTENT_CACHE_KEY, content, FRONTEND_CONTENT_CACHE_TTL_MS);
}

async function updateFrontendContent(patch) {
  const current = await FrontendContent.findOne({ key: "default" }).lean();
  const next = mergeFrontendContent(current, patch);

  const updated = await FrontendContent.findOneAndUpdate(
    { key: "default" },
    { key: "default", ...next },
    { new: true, runValidators: true }
  ).lean();

  invalidateCache(FRONTEND_CONTENT_CACHE_KEY);
  return updated;
}

module.exports = {
  getFrontendContent,
  updateFrontendContent,
};
