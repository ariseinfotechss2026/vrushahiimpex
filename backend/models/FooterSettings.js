const mongoose = require("mongoose");

const footerSettingsSchema = new mongoose.Schema(
  {
    // Brand Description & Social Links
    brandDescription: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    showFacebook: { type: Boolean, default: true },
    instagramUrl: { type: String, default: "" },
    showInstagram: { type: Boolean, default: true },
    linkedinUrl: { type: String, default: "" },
    showLinkedin: { type: Boolean, default: true },
    youtubeUrl: { type: String, default: "" },
    showYoutube: { type: Boolean, default: true },

    // Contact Information Column
    contactPhone: { type: String, default: "" },
    contactPhoneHref: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactAddress: { type: String, default: "" },

    // Bottom Bar & Legal Links
    copyrightText: { type: String, default: "" },
    privacyText: { type: String, default: "Privacy Policy" },
    privacyUrl: { type: String, default: "/privacy-policy" },
    termsText: { type: String, default: "Terms & Conditions" },
    termsUrl: { type: String, default: "/terms-and-conditions" },
  },
  { timestamps: true }
);

// Singleton pattern — get or create initial document
footerSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

module.exports = mongoose.model("FooterSettings", footerSettingsSchema);
