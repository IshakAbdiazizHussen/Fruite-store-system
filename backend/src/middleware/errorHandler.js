function errorHandler(err, _req, res, _next) {
  res.status(500).json({
    error: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
