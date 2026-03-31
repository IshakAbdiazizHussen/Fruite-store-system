const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env"), override: false });

const app = require("./app");
const { connectToDatabase } = require("./config/database");
const { ensureSeedData } = require("./services/seedService");
const { logInfo } = require("./utils/logger");

const port = Number(process.env.PORT || process.env.BACKEND_PORT || 4000);

async function startServer() {
  try {
    const connection = await connectToDatabase();
    await ensureSeedData();

    app.listen(port, () => {
      logInfo(`MongoDB connected: ${connection.host}/${connection.name}`);
      logInfo(`Running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("[backend] Failed to start server", error);
    process.exit(1);
  }
}

startServer();
