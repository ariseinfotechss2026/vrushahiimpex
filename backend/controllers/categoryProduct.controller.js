const CategoryProduct = require("../models/CategoryProduct");
const asyncHandler = require("../utils/asyncHandler");
const apiError = require("../utils/apiError");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

const getCategoryProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.highlight === "true") filter.isHighlight = true;

  const products = await CategoryProduct.find(filter)
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: products });
});

const createCategoryProduct = asyncHandler(async (req, res) => {
  const { name, category, description, isHighlight } = req.body;
  if (!name || !category) throw apiError(400, "Name and category are required");

  const wantHighlight = isHighlight === "true" || isHighlight === true;
  if (wantHighlight) {
    const currentCount = await CategoryProduct.countDocuments({ isHighlight: true });
    if (currentCount >= 3) {
      throw apiError(400, "Maximum 3 products can be marked as Highlight Products");
    }
  }

  const product = new CategoryProduct({
    name,
    category,
    description: description || "",
    isHighlight: wantHighlight,
  });
  if (req.file) product.image = await streamUpload(req.file.buffer, "category-products");

  await product.save();
  await product.populate("category", "name slug");
  res.status(201).json({ success: true, data: product });
});

const updateCategoryProduct = asyncHandler(async (req, res) => {
  const product = await CategoryProduct.findById(req.params.id);
  if (!product) throw apiError(404, "Category Product not found");

  const { name, category, description, isHighlight } = req.body;
  if (name) product.name = name;
  if (category) product.category = category;
  if (description !== undefined) product.description = description;

  if (isHighlight !== undefined) {
    const wantHighlight = isHighlight === "true" || isHighlight === true;
    if (wantHighlight && !product.isHighlight) {
      const currentCount = await CategoryProduct.countDocuments({ isHighlight: true });
      if (currentCount >= 3) {
        throw apiError(400, "Maximum 3 products can be marked as Highlight Products");
      }
    }
    product.isHighlight = wantHighlight;
  }

  if (req.file) {
    const oldPublicId = product.image?.public_id;
    product.image = await streamUpload(req.file.buffer, "category-products");
    if (oldPublicId) deleteImage(oldPublicId);
  }

  await product.save();
  await product.populate("category", "name slug");
  res.json({ success: true, data: product });
});

const toggleHighlightCategoryProduct = asyncHandler(async (req, res) => {
  const product = await CategoryProduct.findById(req.params.id);
  if (!product) throw apiError(404, "Category Product not found");

  const willHighlight = !product.isHighlight;
  if (willHighlight) {
    const currentCount = await CategoryProduct.countDocuments({ isHighlight: true });
    if (currentCount >= 3) {
      throw apiError(400, "Maximum 3 products can be marked as Highlight Products");
    }
  }

  product.isHighlight = willHighlight;
  await product.save();
  await product.populate("category", "name slug");

  res.json({
    success: true,
    data: product,
    message: willHighlight ? "Marked as Highlight Product" : "Removed from Highlight Products",
  });
});

const deleteCategoryProduct = asyncHandler(async (req, res) => {
  const product = await CategoryProduct.findById(req.params.id);
  if (!product) throw apiError(404, "Category Product not found");

  await product.deleteOne();
  if (product.image?.public_id) deleteImage(product.image.public_id);
  res.json({ success: true, data: null });
});

const deleteCategoryProductsBulk = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw apiError(400, "IDs array is required");
  }

  const products = await CategoryProduct.find({ _id: { $in: ids } });
  for (const product of products) {
    if (product.image?.public_id) {
      deleteImage(product.image.public_id);
    }
  }

  await CategoryProduct.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, message: `${products.length} products deleted` });
});

module.exports = {
  getCategoryProducts,
  createCategoryProduct,
  updateCategoryProduct,
  toggleHighlightCategoryProduct,
  deleteCategoryProduct,
  deleteCategoryProductsBulk,
};
