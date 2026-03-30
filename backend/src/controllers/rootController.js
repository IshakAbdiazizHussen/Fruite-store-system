function apiInfo(_req, res) {
  res.status(200).json({
    message: "Fruit Store backend is running",
    endpoints: [
      "/api",
      "/api/health",
      "/api/auth/login",
      "/api/auth/me",
      "/api/auth/logout",
      "/api/frontend-content",
      "/api/inventory",
      "/api/orders",
      "/api/purchases",
      "/api/sales",
      "/api/settings",
      "/api/suppliers",
    ],
  });
}

module.exports = {
  apiInfo,
};
