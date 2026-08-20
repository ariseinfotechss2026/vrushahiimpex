const mongoose = require("mongoose");

const legalSectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  body: { type: String, required: true },
});

const legalPageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ["terms-and-conditions", "privacy-policy"],
    },
    badge: { type: String, default: "" },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    lastUpdated: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    sections: {
      type: [legalSectionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Static helper to retrieve or auto-create clean initial page document
legalPageSchema.statics.getSingletonBySlug = async function (slug) {
  let page = await this.findOne({ slug });

  if (!page) {
    page = await this.create({
      slug,
      badge: slug === "terms-and-conditions" ? "TERMS & CONDITIONS" : "PRIVACY POLICY",
      title: slug === "terms-and-conditions" ? "Terms & Conditions" : "Privacy Policy",
      subtitle: "",
      lastUpdated: "",
      seoDescription: "",
      sections: [],
    });
  }

  return page;
};

module.exports = mongoose.model("LegalPage", legalPageSchema);
