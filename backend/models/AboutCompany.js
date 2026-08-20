const mongoose = require("mongoose");

const aboutCompanySchema = new mongoose.Schema(
  {
    badge: { type: String, default: "" },
    title: { type: String, default: "" },
    highlightWord: { type: String, default: "" },
    leadText: { type: String, default: "" },
    bodyText: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    buttonLink: { type: String, default: "" },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: "" },
        alt: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

// Singleton pattern — get or create initial document
aboutCompanySchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      badge: "",
      title: "",
      highlightWord: "",
      leadText: "",
      bodyText: "",
      buttonText: "",
      buttonLink: "",
      images: [],
    });
  }
  return doc;
};

module.exports = mongoose.model("AboutCompany", aboutCompanySchema);
