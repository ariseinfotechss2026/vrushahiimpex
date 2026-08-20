const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    companyInfo: {
      name: { type: String, default: "" },
      tagline: { type: String, default: "" },
      phone: { type: String, default: "" },
      phoneHref: { type: String, default: "" },
      emails: { type: [String], default: [] },
      addressLines: { type: [String], default: [] },
      mapEmbedSrc: { type: String, default: "" },
      logo: {
        url: String,
        public_id: String,
      },
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Singleton — always operate on the one settings doc, creating it on first access.
siteSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
