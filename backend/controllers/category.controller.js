const Category = require("../models/Category");
const Product = require("../models/Product");
const CategoryProduct = require("../models/CategoryProduct");
const asyncHandler = require("../utils/asyncHandler");
const apiError = require("../utils/apiError");
const slugify = require("../utils/slugify");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  const counts = await CategoryProduct.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
  const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  const data = categories.map((c) => ({ ...c, productCount: countMap[String(c._id)] || 0 }));
  res.json({ success: true, data });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const slugParam = req.params.slug;
  const category = await Category.findOne({
    $or: [
      { slug: slugParam.toLowerCase() },
      { slug: new RegExp(`^${slugParam}$`, "i") },
      { name: new RegExp(`^${slugParam.replace(/-/g, " ")}$`, "i") },
    ],
  }).lean();
  if (!category) throw apiError(404, "Category not found");
  const products = await CategoryProduct.find({ category: category._id }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: { ...category, products } });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, intro, feature1Title, feature1Subtitle, feature2Title, feature2Subtitle } = req.body;
  if (!name) throw apiError(400, "Name is required");

  const category = new Category({
    name,
    slug: slugify(name),
    intro,
    feature1Title,
    feature1Subtitle,
    feature2Title,
    feature2Subtitle,
    showcaseImages: [],
  });

  const files = req.files || [];
  const bannerFile = files.find((f) => f.fieldname === "image" || f.fieldname === "bannerImage");
  if (bannerFile) {
    category.bannerImage = await streamUpload(bannerFile.buffer, "categories");
  }

  const showcaseList = [];
  for (let i = 0; i < 4; i++) {
    const file = files.find((f) => f.fieldname === `showcase_${i}`);
    const nameVal = req.body[`showcaseName_${i}`] || "";
    if (file) {
      const uploaded = await streamUpload(file.buffer, "categories/showcase");
      showcaseList.push({ name: nameVal, url: uploaded.url, public_id: uploaded.public_id });
    }
  }
  category.showcaseImages = showcaseList;

  await category.save();
  res.status(201).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw apiError(404, "Category not found");

  const { name, intro, feature1Title, feature1Subtitle, feature2Title, feature2Subtitle } = req.body;
  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }
  if (intro !== undefined) category.intro = intro;
  if (feature1Title !== undefined) category.feature1Title = feature1Title;
  if (feature1Subtitle !== undefined) category.feature1Subtitle = feature1Subtitle;
  if (feature2Title !== undefined) category.feature2Title = feature2Title;
  if (feature2Subtitle !== undefined) category.feature2Subtitle = feature2Subtitle;

  const files = req.files || [];
  const bannerFile = files.find((f) => f.fieldname === "image" || f.fieldname === "bannerImage");
  if (bannerFile) {
    const oldPublicId = category.bannerImage?.public_id;
    category.bannerImage = await streamUpload(bannerFile.buffer, "categories");
    if (oldPublicId) deleteImage(oldPublicId);
  }

  const currentShowcase = category.showcaseImages || [];
  const updatedShowcase = [];

  for (let i = 0; i < 4; i++) {
    const file = files.find((f) => f.fieldname === `showcase_${i}`);
    const nameVal = req.body[`showcaseName_${i}`] ?? currentShowcase[i]?.name ?? "";
    const existingUrl = req.body[`existingShowcaseUrl_${i}`];
    const existingPublicId = req.body[`existingShowcasePublicId_${i}`];

    if (file) {
      if (currentShowcase[i]?.public_id) {
        deleteImage(currentShowcase[i].public_id);
      }
      const uploaded = await streamUpload(file.buffer, "categories/showcase");
      updatedShowcase.push({ name: nameVal, url: uploaded.url, public_id: uploaded.public_id });
    } else if (existingUrl) {
      updatedShowcase.push({ name: nameVal, url: existingUrl, public_id: existingPublicId || "" });
    } else if (currentShowcase[i]?.url) {
      updatedShowcase.push({ name: nameVal, url: currentShowcase[i].url, public_id: currentShowcase[i].public_id });
    }
  }

  category.showcaseImages = updatedShowcase;

  await category.save();
  res.json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw apiError(404, "Category not found");

  const productCount = await CategoryProduct.countDocuments({ category: category._id });
  if (productCount > 0) throw apiError(400, `Cannot delete — ${productCount} product(s) still use this category`);

  await category.deleteOne();
  if (category.bannerImage?.public_id) deleteImage(category.bannerImage.public_id);
  res.json({ success: true, data: null });
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
