const express = require("express");
const { protect } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");
const {
  getCategoryProducts,
  createCategoryProduct,
  updateCategoryProduct,
  toggleHighlightCategoryProduct,
  deleteCategoryProduct,
  deleteCategoryProductsBulk,
} = require("../controllers/categoryProduct.controller");

const router = express.Router();

router.get("/", getCategoryProducts);
router.post("/", protect, imageUpload.single("image"), createCategoryProduct);
router.post("/delete-bulk", protect, deleteCategoryProductsBulk);
router.patch("/:id/highlight", protect, toggleHighlightCategoryProduct);
router.put("/:id", protect, imageUpload.single("image"), updateCategoryProduct);
router.delete("/:id", protect, deleteCategoryProduct);

module.exports = router;
