const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const apiError = require("../utils/apiError");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

const getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured) filter.featured = true;

  const products = await Product.find(filter).populate("category", "name slug").sort({ createdAt: 1 }).lean();
  res.json({ success: true, data: products });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, category, description, featured } = req.body;
  if (!name) throw apiError(400, "Name is required");

  const product = new Product({ name, category: category || null, description: description || "", featured: featured === "true" || featured === true });
  if (req.file) product.image = await streamUpload(req.file.buffer, "products");
  await product.save();
  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw apiError(404, "Product not found");

  const { name, category, description, featured } = req.body;
  if (name) product.name = name;
  if (category) product.category = category;
  if (description !== undefined) product.description = description;
  if (featured !== undefined) product.featured = featured === "true" || featured === true;

  if (req.file) {
    const oldPublicId = product.image?.public_id;
    product.image = await streamUpload(req.file.buffer, "products");
    if (oldPublicId) deleteImage(oldPublicId);
  }

  await product.save();
  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw apiError(404, "Product not found");

  await product.deleteOne();
  if (product.image?.public_id) deleteImage(product.image.public_id);
  res.json({ success: true, data: null });
});

const deleteProductsBulk = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw apiError(400, "IDs array is required");
  }

  const products = await Product.find({ _id: { $in: ids } });
  for (const product of products) {
    if (product.image?.public_id) {
      deleteImage(product.image.public_id);
    }
  }

  await Product.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, message: `${products.length} products deleted` });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, deleteProductsBulk };
