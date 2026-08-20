const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: {
      url: String,
      public_id: String,
    },
    date: { type: Date, default: Date.now },
    category: { type: String, default: "" },
    readTime: { type: String, default: "" },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);
