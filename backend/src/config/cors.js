const allowedOrigins = (process.env.CORS_ORIGINS || "https://localhost:3000,http://localhost:3000")
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
