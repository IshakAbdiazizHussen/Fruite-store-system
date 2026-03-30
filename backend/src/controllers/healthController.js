const { getDatabaseStatus } = require("../config/database");

function healthCheck(_req, res) {
  res.status(200).json({
    ok: true,
    service: "fruit-store-backend",
    timestamp: new Date().toISOString(),
    database: getDatabaseStatus(),
  });
}

module.exports = {
  healthCheck,
};
