require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const AboutUsPage = require("../models/AboutUsPage");

(async () => {
  try {
    await connectDB();

    const defaultCoreValues = [
      {
        icon: "ShieldCheck",
        title: "Micro-Sterilized Quality",
        description:
          "We employ advanced sterilization techniques to control micro-contamination as per stringent international food safety parameters.",
      },
      {
        icon: "Award",
        title: "Official Government Certifications",
        description:
          "Proudly registered & certified by the Spices Board of India and APEDA for export of agricultural commodities worldwide.",
      },
      {
        icon: "Globe",
        title: "Global Supply Chain Network",
        description:
          "Efficient logistics and cold-chain management ensuring timely, fresh, and eco-sealed delivery to any port across the world.",
      },
      {
        icon: "Sparkles",
        title: "Cost-Benefit & Buyer Trust",
        description:
          "Our core philosophy centers around complete customer satisfaction, offering premium quality at highly competitive market rates.",
      },
    ];

    let aboutUs = await AboutUsPage.findOne();
    if (!aboutUs) {
      aboutUs = new AboutUsPage({
        standardsBadge: "OUR STANDARDS",
        standardsTitle: "Why Global Importers Choose Vrushahi Impex",
        standardsDescription:
          "We operate with uncompromising standards to safeguard food purity and customer confidence.",
        coreValues: defaultCoreValues,
      });
    } else {
      aboutUs.standardsBadge = aboutUs.standardsBadge || "OUR STANDARDS";
      aboutUs.standardsTitle =
        aboutUs.standardsTitle || "Why Global Importers Choose Vrushahi Impex";
      aboutUs.standardsDescription =
        aboutUs.standardsDescription ||
        "We operate with uncompromising standards to safeguard food purity and customer confidence.";
      aboutUs.coreValues = defaultCoreValues;
    }

    await aboutUs.save();
    console.log("Successfully seeded 4 core value cards into AboutUsPage in database!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding AboutUsPage:", error);
    process.exit(1);
  }
})();
