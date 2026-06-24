function publicCache(cacheControlValue) {
  return function cacheControlMiddleware(_req, res, next) {
    res.set("Cache-Control", cacheControlValue);
    next();
  };
}

function noStore(_req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
}

module.exports = {
  noStore,
  publicCache,
};
