const dns = require("dns");
const mongoose = require("mongoose");

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set. Add your MongoDB Atlas connection string to the environment.");
  }

  return mongoUri;
}

function extractMongoHost(mongoUri) {
  const match = mongoUri.match(/@([^/?]+)/);
  return match ? match[1] : null;
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

async function connectToDatabase() {
  const mongoUri = getMongoUri();
  configureDnsForMongoUri(mongoUri);

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    const host = extractMongoHost(mongoUri);
    const atlasLookupFailed =
      mongoUri.startsWith("mongodb+srv://") &&
      (error?.code === "ECONNREFUSED" ||
        error?.code === "ENOTFOUND" ||
        String(error?.message || "").includes("querySrv"));

    if (atlasLookupFailed) {
      throw new Error(
        `MongoDB Atlas host lookup failed for ${host || "the configured cluster host"}. ` +
          "Check MONGODB_URI in backend/.env and replace it with a current Atlas connection string, " +
          "or use a local MongoDB URI such as mongodb://127.0.0.1:27017/fruit-store."
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
  };
}

module.exports = {
  connectToDatabase,
  getDatabaseStatus,
};
