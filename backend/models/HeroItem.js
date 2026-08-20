const mongoose = require("mongoose");

const heroSubItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      url: String,
      public_id: String,
    },
    description: { type: String, required: true },
  },
  { _id: false }
);

const heroItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    eyebrow: { type: String, required: true },
    titleLine1: { type: String, required: true },
    titleLine2: { type: String, required: true },
    blurb: { type: String, required: true },
    image: {
      url: String,
      public_id: String,
    },
    tint: { type: String, required: true },
    badge: { type: String, required: true },
    rating: { type: String, required: true },
    reviewsCount: { type: String, required: true },
    prepTime: { type: String, required: true },
    calories: { type: String, required: true },
    spiceLevel: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    videoUrl: { type: String },
    price: { type: String, required: true },
    order: { type: Number, default: 0 },
    items: { type: [heroSubItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroItem", heroItemSchema);
