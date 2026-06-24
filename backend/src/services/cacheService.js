const cacheEntries = new Map();

function getCache(key) {
  const entry = cacheEntries.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= Date.now()) {
    cacheEntries.delete(key);
    return null;
  }

  return entry.value;
}

function setCache(key, value, ttlMs) {
  cacheEntries.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
  return value;
}

function invalidateCache(key) {
  cacheEntries.delete(key);
}

module.exports = {
  getCache,
  invalidateCache,
  setCache,
};
