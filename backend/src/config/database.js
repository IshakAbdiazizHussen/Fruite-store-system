const dns = require("dns");
const mongoose = require("mongoose");

const DEFAULT_LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/fruit-store";

let lastConnectionMeta = {
  source: "disconnected",
  uri: null,
  fallbackAttempted: false,
};

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set. Add your MongoDB Atlas connection string to the environment.");
  }

  return mongoUri;
}

function getFallbackMongoUri(primaryUri) {
  const fallbackUri = process.env.MONGODB_FALLBACK_URI || DEFAULT_LOCAL_MONGO_URI;
  return fallbackUri === primaryUri ? null : fallbackUri;
}

function isLocalFallbackEnabled() {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return !["false", "0", "no"].includes(
    String(process.env.MONGODB_ENABLE_LOCAL_FALLBACK || "true").toLowerCase()
  );
}

function extractMongoHost(mongoUri) {
  try {
    if (mongoUri.startsWith("mongodb://") || mongoUri.startsWith("mongodb+srv://")) {
      const normalizedUri = mongoUri.replace(/^mongodb(\+srv)?:\/\//, "http://");
      const { host } = new URL(normalizedUri);
      return host || null;
    }
  } catch (_error) {
    // Fall back to regex parsing below for malformed URIs.
  }

  const authMatch = mongoUri.match(/@([^/?]+)/);
  if (authMatch) {
    return authMatch[1];
  }

  const directMatch = mongoUri.match(/^mongodb(?:\+srv)?:\/\/([^/?]+)/);
  return directMatch ? directMatch[1] : null;
}

function isAtlasUri(mongoUri) {
  const host = extractMongoHost(mongoUri) || "";
  return mongoUri.startsWith("mongodb+srv://") || host.includes("mongodb.net");
}

function configureDnsForMongoUri(mongoUri) {
  if (!mongoUri.startsWith("mongodb+srv://")) {
    return;
  }

  const configuredServers = String(process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (configuredServers.length > 0) {
    dns.setServers(configuredServers);
  }
}

function isAtlasAccessError(mongoUri, error) {
  if (!isAtlasUri(mongoUri)) {
    return false;
  }

  const message = String(error?.message || "");
  const code = String(error?.code || "");

  return (
    code === "ENOTFOUND" ||
    code === "ECONNREFUSED" ||
    message.includes("querySrv") ||
    message.includes("MongoDB Atlas cluster") ||
    message.includes("ReplicaSetNoPrimary") ||
    message.includes("Server selection timed out") ||
    message.includes("IP that isn't whitelisted")
  );
}

function isLocalMongoUnavailable(mongoUri, error) {
  const host = extractMongoHost(mongoUri);
  const message = String(error?.message || "");

  return (
    !!host &&
    ["127.0.0.1:27017", "localhost:27017"].includes(host) &&
    (error?.code === "ECONNREFUSED" ||
      error?.code === "EPERM" ||
      message.includes("127.0.0.1:27017") ||
      message.includes("localhost:27017"))
  );
}

function formatDatabaseErrorDetail(error) {
  const message = String(error?.message || "").trim();
  const causeMessage = String(error?.cause?.message || "").trim();
  const code = String(error?.code || "").trim();
  const detail = causeMessage || message || code;

  return detail ? ` Details: ${detail}` : "";
}

async function connectWithUri(mongoUri, source) {
  configureDnsForMongoUri(mongoUri);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10000,
  });

  lastConnectionMeta = {
    source: source || (isAtlasUri(mongoUri) ? "atlas" : "local"),
    uri: mongoUri,
    fallbackAttempted: source === "local-fallback",
  };

  return mongoose.connection;
}

async function connectToDatabase() {
  const mongoUri = getMongoUri();
  const fallbackUri = isLocalFallbackEnabled() ? getFallbackMongoUri(mongoUri) : null;

  try {
    return await connectWithUri(mongoUri, isAtlasUri(mongoUri) ? "atlas" : "local");
  } catch (error) {
    lastConnectionMeta = {
      source: "failed",
      uri: mongoUri,
      fallbackAttempted: false,
    };

    if (isAtlasAccessError(mongoUri, error) && fallbackUri) {
      try {
        return await connectWithUri(fallbackUri, "local-fallback");
      } catch (fallbackError) {
        lastConnectionMeta = {
          source: "failed",
          uri: mongoUri,
          fallbackAttempted: true,
        };

        if (isLocalMongoUnavailable(fallbackUri, fallbackError)) {
          throw new Error(
            "MongoDB Atlas rejected the connection from this machine, and the local fallback is not running. " +
              "Either add your current IP address to the Atlas network access list, or start local MongoDB with `docker compose up -d mongo` from the repository root." +
              formatDatabaseErrorDetail(error)
          );
        }

        throw fallbackError;
      }
    }

    if (isAtlasAccessError(mongoUri, error)) {
      const host = extractMongoHost(mongoUri);
      throw new Error(
        `MongoDB Atlas connection failed for ${host || "the configured cluster host"}. ` +
          "This usually means the current machine is not allowed by Atlas Network Access or the URI is no longer valid. " +
          "Add your current IP address in Atlas, or switch backend/.env to a local URI such as mongodb://127.0.0.1:27017/fruit-store." +
          formatDatabaseErrorDetail(error)
      );
    }

    if (isLocalMongoUnavailable(mongoUri, error)) {
      throw new Error(
        "MongoDB is not running at mongodb://127.0.0.1:27017/fruit-store. " +
          "Start a local MongoDB server first, or run `docker compose up -d mongo` from the repository root. " +
          "If you want to use MongoDB Atlas instead, update MONGODB_URI in backend/.env."
      );
    }

    throw error;
  }

  return mongoose.connection;
}

function getDatabaseStatus() {
  const readyStateLabels = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    name: mongoose.connection.name || process.env.MONGODB_DB_NAME || null,
    host: mongoose.connection.host || null,
    readyState: readyStateLabels[mongoose.connection.readyState] || "unknown",
    source: lastConnectionMeta.source,
    fallbackAttempted: lastConnectionMeta.fallbackAttempted,
  };
}

module.exports = {
  connectToDatabase,
  getDatabaseStatus,
};
