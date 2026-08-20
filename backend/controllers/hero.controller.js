const HeroItem = require("../models/HeroItem");
const asyncHandler = require("../utils/asyncHandler");
const apiError = require("../utils/apiError");
const slugify = require("../utils/slugify");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

let cachedHeroItems = null;

const invalidateHeroCache = () => {
  cachedHeroItems = null;
};

const getHeroItems = asyncHandler(async (req, res) => {
  if (cachedHeroItems) {
    return res.json({ success: true, data: cachedHeroItems });
  }
  const items = await HeroItem.find().sort({ order: 1 }).lean();
  cachedHeroItems = items;
  res.json({ success: true, data: items });
});

// Sub-item images arrive as files named `item_<index>` (see middleware/upload.js `.any()`).
// req.body.items is a JSON string: [{ name, description, image?: {url,public_id} }]
// — `image` present means "keep this existing image", absent means a new file at that index is expected.
const buildItems = async (rawItems, files, previousItems = []) => {
  const parsed = JSON.parse(rawItems || "[]");
  const fileByIndex = Object.fromEntries(
    files.filter((f) => f.fieldname.startsWith("item_")).map((f) => [f.fieldname.split("_")[1], f])
  );

  const items = await Promise.all(
    parsed.map(async (item, index) => {
      const file = fileByIndex[String(index)];
      const image = file ? await streamUpload(file.buffer, "hero") : item.image || undefined;
      return { name: item.name, description: item.description, image };
    })
  );

  // Clean up Cloudinary images from sub-items that were replaced or removed.
  const keptPublicIds = new Set(items.map((i) => i.image?.public_id).filter(Boolean));
  previousItems.forEach((prev) => {
    if (prev.image?.public_id && !keptPublicIds.has(prev.image.public_id)) deleteImage(prev.image.public_id);
  });

  return items;
};

const parseFields = (body) => {
  const {
    name,
    eyebrow,
    titleLine1,
    titleLine2,
    blurb,
    tint,
    badge,
    rating,
    reviewsCount,
    prepTime,
    calories,
    spiceLevel,
    description,
    ingredients,
    videoUrl,
    price,
    order,
  } = body;
  return {
    name,
    eyebrow,
    titleLine1,
    titleLine2,
    blurb,
    tint,
    badge,
    rating,
    reviewsCount,
    prepTime,
    calories,
    spiceLevel,
    description,
    ingredients: ingredients ? ingredients.split(",").map((s) => s.trim()).filter(Boolean) : [],
    videoUrl,
    price,
    order: order !== undefined ? Number(order) : undefined,
  };
};

const createHeroItem = asyncHandler(async (req, res) => {
  const fields = parseFields(req.body);
  if (!fields.name) throw apiError(400, "Name is required");

  const files = req.files || [];
  const mainImageFile = files.find((f) => f.fieldname === "image");

  const heroItem = new HeroItem({ ...fields, slug: slugify(fields.name) });
  if (mainImageFile) heroItem.image = await streamUpload(mainImageFile.buffer, "hero");
  heroItem.items = await buildItems(req.body.items, files);

  await heroItem.save();
  invalidateHeroCache();
  res.status(201).json({ success: true, data: heroItem });
});

const updateHeroItem = asyncHandler(async (req, res) => {
  const heroItem = await HeroItem.findById(req.params.id);
  if (!heroItem) throw apiError(404, "Hero item not found");

  const fields = parseFields(req.body);
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) heroItem[key] = value;
  });
  if (fields.name) heroItem.slug = slugify(fields.name);

  const files = req.files || [];
  const mainImageFile = files.find((f) => f.fieldname === "image");
  if (mainImageFile) {
    const oldPublicId = heroItem.image?.public_id;
    heroItem.image = await streamUpload(mainImageFile.buffer, "hero");
    if (oldPublicId) deleteImage(oldPublicId);
  }

  if (req.body.items !== undefined) {
    heroItem.items = await buildItems(req.body.items, files, heroItem.items);
  }

  await heroItem.save();
  invalidateHeroCache();
  res.json({ success: true, data: heroItem });
});

const deleteHeroItem = asyncHandler(async (req, res) => {
  const heroItem = await HeroItem.findById(req.params.id);
  if (!heroItem) throw apiError(404, "Hero item not found");

  await heroItem.deleteOne();
  invalidateHeroCache();
  if (heroItem.image?.public_id) deleteImage(heroItem.image.public_id);
  heroItem.items.forEach((item) => item.image?.public_id && deleteImage(item.image.public_id));
  res.json({ success: true, data: null });
});

module.exports = { getHeroItems, createHeroItem, updateHeroItem, deleteHeroItem };
