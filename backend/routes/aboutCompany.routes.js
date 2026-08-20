const express = require("express");
const { protect } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");
const { getAboutCompany, updateAboutCompany } = require("../controllers/aboutCompany.controller");

const router = express.Router();

router.get("/", getAboutCompany);
router.put("/", protect, imageUpload.any(), updateAboutCompany);

module.exports = router;
