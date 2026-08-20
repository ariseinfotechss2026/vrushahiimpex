const express = require("express");
const { protect } = require("../middleware/auth");
const { getLegalPage, updateLegalPage } = require("../controllers/legalPage.controller");

const router = express.Router();

router.get("/:slug", getLegalPage);
router.put("/:slug", protect, updateLegalPage);

module.exports = router;
