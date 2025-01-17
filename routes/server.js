const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createServer,
  createChannel,
} = require("../controllers/serverController");
const router = express.Router();

router.post("/server", protect, authorize(["user"]), createServer); // Quitar user en el futuro
router.post(
  "/channel",
  protect,
  authorize(["admin", "moderator", "user"]), // Quitar en el futuro user
  createChannel
);

module.exports = router;
