function apiInfo(_req, res) {
  res.status(200).json({
    message: "Fruit Store backend is running",
    endpoints: ["/api", "/api/health"],
  });
}

module.exports = {
  apiInfo,
};
