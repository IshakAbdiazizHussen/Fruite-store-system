const express = require("express");

const { healthCheck } = require("../controllers/healthController");
const { apiInfo } = require("../controllers/rootController");

const router = express.Router();

router.get("/", apiInfo);
router.get("/health", healthCheck);

module.exports = router;
