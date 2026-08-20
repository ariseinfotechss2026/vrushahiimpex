const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const enquiryFeatureSchema = new mongoose.Schema({
  icon: { type: String, default: "Clock" },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const contactUsPageSchema = new mongoose.Schema(
  {
    // Hero Header Section
    heroBadge: { type: String, default: "" },
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },

    // Headquarters Card
    headquartersBadge: { type: String, default: "" },
    headquartersTitle: { type: String, default: "" },
    headquartersAddress: { type: String, default: "" },
    headquartersMapUrl: { type: String, default: "" },

    // Call & WhatsApp Card
    phoneBadge: { type: String, default: "" },
    phoneTitle: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    phoneHours: { type: String, default: "" },
    phoneCallHref: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },

    // Official Email Card
    emailBadge: { type: String, default: "" },
    emailTitle: { type: String, default: "" },
    primaryEmail: { type: String, default: "" },
    secondaryEmail: { type: String, default: "" },

    // Form Section Header
    formBadge: { type: String, default: "" },
    formTitle: { type: String, default: "" },
    formSubtitle: { type: String, default: "" },

    // Product Enquiry Page Sidebar Section
    enquirySupportTitle: { type: String, default: "" },
    enquirySupportSubtitle: { type: String, default: "" },
    enquirySupportFeatures: {
      type: [enquiryFeatureSchema],
      default: [],
    },
    enquiryTradeDeskTitle: { type: String, default: "" },
    enquiryTradeDeskPhone: { type: String, default: "" },
    enquiryTradeDeskEmail: { type: String, default: "" },
    enquiryTradeDeskLocation: { type: String, default: "" },

    // FAQ Section
    faqBadge: { type: String, default: "" },
    faqTitle: { type: String, default: "" },
    faqSubtitle: { type: String, default: "" },
    faqs: {
      type: [faqSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Singleton pattern — get or create initial document
contactUsPageSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

module.exports = mongoose.model("ContactUsPage", contactUsPageSchema);
