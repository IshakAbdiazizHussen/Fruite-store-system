const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://127.0.0.1:3000",
].join(",");

const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Blocked by CORS policy"));
  },
  credentials: true,
};

module.exports = {
  corsOptions,
};
