const express = require("express");
const { protect } = require("../middleware/auth");
const { getContactUsPage, updateContactUsPage } = require("../controllers/contactUsPage.controller");

const router = express.Router();

router.get("/", getContactUsPage);
router.put("/", protect, updateContactUsPage);

module.exports = router;
