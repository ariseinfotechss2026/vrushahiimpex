const mongoose = require("mongoose");

const heroVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    public_id: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroVideo", heroVideoSchema);
