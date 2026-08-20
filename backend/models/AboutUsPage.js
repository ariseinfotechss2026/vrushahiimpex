const mongoose = require("mongoose");

const coreValueSchema = new mongoose.Schema({
  icon: { type: String, default: "ShieldCheck" },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const aboutUsPageSchema = new mongoose.Schema(
  {
    // Story & Heritage Section
    storyBadge: { type: String, default: "" },
    storyTitleLine1: { type: String, default: "" },
    storyTitleHighlight: { type: String, default: "" },
    storyParagraph1: { type: String, default: "" },
    storyParagraph2: { type: String, default: "" },
    certifications: {
      type: [String],
      default: [],
    },
    heroImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    heroImageCaptionTitle: { type: String, default: "" },
    heroImageCaptionSub: { type: String, default: "" },
    ctaButtonText: { type: String, default: "" },
    ctaButtonLink: { type: String, default: "" },

    // Standards & Core Values Section
    standardsBadge: { type: String, default: "" },
    standardsTitle: { type: String, default: "" },
    standardsDescription: { type: String, default: "" },
    coreValues: {
      type: [coreValueSchema],
      default: [],
    },

    // Mission & Vision Section
    missionTitle: { type: String, default: "" },
    missionDescription: { type: String, default: "" },
    visionTitle: { type: String, default: "" },
    visionDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

// Singleton pattern — get or create initial document
aboutUsPageSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

module.exports = mongoose.model("AboutUsPage", aboutUsPageSchema);
