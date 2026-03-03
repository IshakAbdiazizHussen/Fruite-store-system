const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { logInfo } = require("./utils/logger");

const port = Number(process.env.BACKEND_PORT || 4000);

app.listen(port, () => {
  logInfo(`Running on http://localhost:${port}`);
});
