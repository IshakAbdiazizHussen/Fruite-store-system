const express = require("express");

const authenticate = require("../middleware/authenticate");
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

const router = express.Router();
const protectedRouter = express.Router();

router.get("/", apiInfo);
router.get("/health", healthCheck);
router.post("/auth/login", authController.login);
router.get("/frontend-content", frontendContentController.getFrontendContent);

protectedRouter.use(authenticate);
protectedRouter.get("/auth/me", authController.me);
protectedRouter.post("/auth/logout", authController.logout);

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
protectedRouter.delete("/suppliers/:id", supplierController.remove);
protectedRouter.post("/suppliers/reset", supplierController.resetSuppliers);

router.use(protectedRouter);

module.exports = router;
