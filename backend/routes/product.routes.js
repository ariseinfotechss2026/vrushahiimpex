const express = require("express");
const { protect } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");
const { getProducts, createProduct, updateProduct, deleteProduct, deleteProductsBulk } = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, imageUpload.single("image"), createProduct);
router.post("/delete-bulk", protect, deleteProductsBulk);
router.put("/:id", protect, imageUpload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
