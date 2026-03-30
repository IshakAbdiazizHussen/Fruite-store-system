function errorHandler(err, _req, res, _next) {
  const statusCode = Number(err.statusCode || 500);

  res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
