const express = require("express");
const { protect } = require("../middleware/auth");
const { getStats } = require("../controllers/admin.controller");

const router = express.Router();

router.get("/stats", protect, getStats);

module.exports = router;
