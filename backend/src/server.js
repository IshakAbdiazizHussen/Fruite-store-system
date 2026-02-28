const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = Number(process.env.BACKEND_PORT || 4000);

const allowedOrigins = (process.env.CORS_ORIGINS ||
  "https://localhost:3000,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Blocked by CORS policy"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "fruit-store-backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "Fruit Store backend is running",
    endpoints: ["/api", "/api/health"],
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
