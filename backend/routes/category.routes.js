const express = require("express");
const { protect } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", protect, imageUpload.any(), createCategory);
router.put("/:id", protect, imageUpload.any(), updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;
