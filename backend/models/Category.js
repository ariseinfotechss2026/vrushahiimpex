const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bannerImage: {
      url: String,
      public_id: String,
    },
    intro: { type: String, default: "" },
    feature1Title: { type: String, default: "" },
    feature1Subtitle: { type: String, default: "" },
    feature2Title: { type: String, default: "" },
    feature2Subtitle: { type: String, default: "" },
    showcaseImages: [
      {
        name: String,
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
