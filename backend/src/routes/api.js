const express = require("express");

const authenticate = require("../middleware/authenticate");
const { noStore, publicCache } = require("../middleware/cacheControl");
const authController = require("../controllers/authController");
const frontendContentController = require("../controllers/frontendContentController");
const { healthCheck } = require("../controllers/healthController");
const { apiInfo } = require("../controllers/rootController");
const inventoryController = require("../controllers/inventoryController");
const orderController = require("../controllers/orderController");
const purchaseController = require("../controllers/purchaseController");
const salesController = require("../controllers/salesController");
const settingsController = require("../controllers/settingsController");
const supplierController = require("../controllers/supplierController");
const { profileImageUpload } = require("../middleware/profileImageUpload");
const { createRateLimit } = require("../middleware/rateLimit");

const router = express.Router();
const protectedRouter = express.Router();
const forgotPasswordRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  keyGenerator: (req) =>
    `forgot:${req.ip}:${String(req.body?.email || "").trim().toLowerCase()}`,
});
const resetPasswordRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  keyGenerator: (req) => `reset:${req.ip}:${req.params.token || "unknown"}`,
});

router.get("/", apiInfo);
router.get("/health", healthCheck);
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/forgot-password", forgotPasswordRateLimit, authController.forgotPassword);
router.get("/auth/google", authController.startGoogleOauth);
router.get("/auth/google/callback", authController.googleOauthCallback);
router.get("/auth/apple", authController.startAppleOauth);
router.post("/auth/apple/callback", authController.appleOauthCallback);
router.get("/auth/apple/callback", authController.appleOauthCallback);
router.get("/auth/reset-password/:token", resetPasswordRateLimit, authController.validateResetToken);
router.post("/auth/reset-password/:token", resetPasswordRateLimit, authController.resetPasswordWithToken);
router.get("/frontend-content", publicCache("public, max-age=60, stale-while-revalidate=300"), frontendContentController.getFrontendContent);

protectedRouter.use(authenticate);
protectedRouter.use(noStore);
protectedRouter.get("/auth/me", authController.me);
protectedRouter.post("/auth/logout", authController.logout);
protectedRouter.post("/auth/me/profile-image", profileImageUpload, authController.uploadImage);
protectedRouter.put("/auth/me/profile-image", profileImageUpload, authController.replaceImage);
protectedRouter.delete("/auth/me/profile-image", authController.removeImage);

protectedRouter.get("/inventory", inventoryController.list);
protectedRouter.post("/inventory", inventoryController.create);
protectedRouter.put("/inventory/:id", inventoryController.update);
protectedRouter.delete("/inventory/:id", inventoryController.remove);

protectedRouter.get("/orders", orderController.list);
protectedRouter.post("/orders", orderController.create);
protectedRouter.put("/orders/:id", orderController.update);
protectedRouter.delete("/orders/:id", orderController.remove);

protectedRouter.get("/purchases", purchaseController.list);
protectedRouter.post("/purchases", purchaseController.create);
protectedRouter.put("/purchases/:id", purchaseController.update);

protectedRouter.get("/sales", salesController.listSales);
protectedRouter.post("/sales", salesController.createSale);

protectedRouter.get("/settings", settingsController.getSettings);
protectedRouter.patch("/settings", settingsController.updateSettings);
protectedRouter.patch("/frontend-content", frontendContentController.updateFrontendContent);

protectedRouter.get("/suppliers", supplierController.list);
protectedRouter.post("/suppliers", supplierController.create);
protectedRouter.put("/suppliers/:id", supplierController.update);
protectedRouter.delete("/suppliers/:id", supplierController.remove);
protectedRouter.post("/suppliers/reset", supplierController.resetSuppliers);

router.use(protectedRouter);

module.exports = router;
