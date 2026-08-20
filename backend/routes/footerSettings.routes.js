const express = require("express");
const { protect } = require("../middleware/auth");
const { getFooterSettings, updateFooterSettings } = require("../controllers/footerSettings.controller");

const router = express.Router();

router.get("/", getFooterSettings);
router.put("/", protect, updateFooterSettings);

module.exports = router;
