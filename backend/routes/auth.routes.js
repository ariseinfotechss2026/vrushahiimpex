const express = require("express");
const { protect } = require("../middleware/auth");
const { login, logout, me, updatePassword, updateProfile } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.patch("/me", protect, updateProfile);
router.patch("/me/password", protect, updatePassword);

module.exports = router;
