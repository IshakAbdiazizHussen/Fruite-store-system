const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env"), override: false });

const app = require("./app");
const { connectToDatabase, getDatabaseStatus } = require("./config/database");
const { ensureSeedData } = require("./services/seedService");
const { logInfo } = require("./utils/logger");

const port = Number(process.env.PORT || process.env.BACKEND_PORT || 4000);

async function startServer() {
  try {
    const connection = await connectToDatabase();
    await ensureSeedData();

    app.listen(port, () => {
      const databaseStatus = getDatabaseStatus();
      const connectionLabelMap = {
        atlas: "MongoDB connected to Atlas",
        local: "MongoDB connected to local instance",
        "local-fallback": "MongoDB connected using development local fallback",
      };
      const connectionLabel = connectionLabelMap[databaseStatus.source] || "MongoDB connected";

      logInfo(`${connectionLabel}: ${connection.host}/${connection.name}`);
      logInfo(`Running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("[backend] Failed to start server", error);
    process.exit(1);
  }
}

startServer();
