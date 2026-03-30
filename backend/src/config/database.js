const mongoose = require("mongoose");

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set. Add your MongoDB Atlas connection string to the environment.");
  }

  return mongoUri;
}

async function connectToDatabase() {
  const mongoUri = getMongoUri();

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME,
  });

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
