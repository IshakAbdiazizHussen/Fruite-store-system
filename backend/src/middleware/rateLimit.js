function createRateLimit({ windowMs, maxRequests, keyGenerator }) {
  const hits = new Map();

  return function rateLimit(req, res, next) {
    const now = Date.now();
    const key = keyGenerator(req);
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      next();
      return;
    }

    entry.count += 1;

    if (entry.count > maxRequests) {
      res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
      return;
    }

    next();
  };
}

module.exports = {
  createRateLimit,
};
