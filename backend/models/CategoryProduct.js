const mongoose = require("mongoose");

const categoryProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    image: {
      url: String,
      public_id: String,
    },
    description: { type: String, default: "" },
    isHighlight: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryProduct", categoryProductSchema);
