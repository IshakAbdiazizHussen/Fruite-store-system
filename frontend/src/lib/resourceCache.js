"use client";

const resourceStore = new Map();
const STORAGE_PREFIX = "fruit_store_resource_cache:";

function ensureEntry(key) {
  if (!resourceStore.has(key)) {
    resourceStore.set(key, {
      data: undefined,
      error: "",
      updatedAt: 0,
      promise: null,
      listeners: new Set(),
      persisted: false,
    });
  }

  return resourceStore.get(key);
}

function notify(entry) {
  entry.listeners.forEach((listener) => listener());
}

function getStorage(persist) {
  if (typeof window === "undefined") return null;
  if (persist === "local") return window.localStorage;
  if (persist === "session") return window.sessionStorage;
  return null;
}

function readPersistedEntry(key, persist) {
  const storage = getStorage(persist);
  if (!storage) return null;

  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writePersistedEntry(key, persist, payload) {
  const storage = getStorage(persist);
  if (!storage) return;

  try {
    storage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or serialization failures.
  }
}

function removePersistedEntry(key, persist) {
  const storage = getStorage(persist);
  if (!storage) return;

  try {
    storage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore storage failures.
  }
}

export function hydrateCachedResource(key, { persist = "none" } = {}) {
  const entry = ensureEntry(key);

  if (entry.persisted || persist === "none") {
    return entry;
  }

  const persistedEntry = readPersistedEntry(key, persist);
  if (persistedEntry) {
    entry.data = persistedEntry.data;
    entry.updatedAt = Number(persistedEntry.updatedAt || 0);
  }

  entry.persisted = true;
  return entry;
}

export function getCachedResourceState(key, { persist = "none" } = {}) {
  return hydrateCachedResource(key, { persist });
}

export function subscribeCachedResource(key, listener) {
  const entry = ensureEntry(key);
  entry.listeners.add(listener);

  return () => {
    entry.listeners.delete(listener);
  };
}

export function primeCachedResource(key, data, { persist = "none", error = "" } = {}) {
  const entry = ensureEntry(key);
  entry.data = data;
  entry.error = error;
  entry.updatedAt = Date.now();
  entry.persisted = true;

  if (persist !== "none") {
    writePersistedEntry(key, persist, {
      data,
      updatedAt: entry.updatedAt,
    });
  }

  notify(entry);
  return data;
}

export function invalidateCachedResource(key, { persist = "none" } = {}) {
  const entry = ensureEntry(key);
  entry.data = undefined;
  entry.error = "";
  entry.updatedAt = 0;
  entry.promise = null;

  if (persist !== "none") {
    removePersistedEntry(key, persist);
  }

  notify(entry);
}

export async function fetchCachedResource(
  key,
  fetcher,
  { persist = "none", staleTimeMs = 30_000, force = false } = {}
) {
  const entry = hydrateCachedResource(key, { persist });
  const hasFreshData =
    entry.updatedAt > 0 && Date.now() - entry.updatedAt < staleTimeMs && entry.data !== undefined;

  if (!force && hasFreshData) {
    return entry.data;
  }

  if (entry.promise) {
    return entry.promise;
  }

  entry.promise = (async () => {
    try {
      const data = await fetcher();
      primeCachedResource(key, data, { persist, error: "" });
      return data;
    } catch (error) {
      entry.error = error.message || "Failed to fetch resource.";
      notify(entry);
      throw error;
    } finally {
      entry.promise = null;
    }
  })();

  return entry.promise;
}
