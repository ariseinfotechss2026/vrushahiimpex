const express = require("express");
const { protect } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");
const { getAboutUsPage, updateAboutUsPage } = require("../controllers/aboutUsPage.controller");

const router = express.Router();

router.get("/", getAboutUsPage);
router.put("/", protect, imageUpload.single("heroImage"), updateAboutUsPage);

module.exports = router;
