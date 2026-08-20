require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const ContactUsPage = require("../models/ContactUsPage");

(async () => {
  try {
    await connectDB();

    const defaultFaqs = [
      {
        question: "What agricultural products and spices do you export?",
        answer:
          "We export export-quality Indian spices (turmeric, red chili, cumin, cardamom, coriander), premium dry fruits (cashews, raisins, almonds), fresh agro produce, and artisanal handicrafts sourced directly from Sangli and top Indian origins.",
      },
      {
        question: "Do your products conform to international food safety and APEDA standards?",
        answer:
          "Yes, Vrushahi Impex is certified by the Spices Board of India and APEDA. All export consignments undergo micro-sterilization, strict quality control, and complete physical and microbiological parameter testing before shipment.",
      },
      {
        question: "What are your minimum order quantities (MOQ) and packaging options?",
        answer:
          "MOQs depend on the product category and sea/air freight specifications. We provide customized export-grade vacuum sealing, jute bags, food-grade pouch packing, and buyer-branded private label packaging upon request.",
      },
      {
        question: "How do I request a formal price quote and Certificates of Analysis (COA)?",
        answer:
          "You can submit an inquiry through our Product Enquiry or Contact page form with your target product, estimated quantity, and destination port. Our trade desk will respond within 24 hours with FOB/CIF pricing and specification sheets.",
      },
      {
        question: "Which global ports and destinations do you ship to?",
        answer:
          "We export worldwide to ports across North America, Europe, the Middle East, Southeast Asia, and Australia, managing end-to-end customs documentation, Phytosanitary Certificates, and cold-chain logistics.",
      },
    ];

    const defaultFeatures = [
      {
        icon: "Clock",
        title: "24/7 Rapid Trade Desk Response",
        description: "Our export specialists answer pricing, COA, and port logistics queries within 24 hours.",
      },
      {
        icon: "PackageCheck",
        title: "Custom Bulk & Private Label Packaging",
        description: "Vacuum packaging, buyer brand labeling, and moisture-proof export packaging.",
      },
      {
        icon: "Award",
        title: "APEDA & Spices Board Certified",
        description: "100% compliance with international food safety and quality standards.",
      },
      {
        icon: "ShieldCheck",
        title: "Micro-Sterilized & Lab Tested",
        description: "Rigorous physical and microbiological parameter conformance for all shipments.",
      },
    ];

    let contactUs = await ContactUsPage.findOne();
    if (!contactUs) {
      contactUs = new ContactUsPage({
        heroBadge: "DIRECT GLOBAL EXPORT SUPPORT",
        heroTitle: "Connect With Our Export Desk",
        heroSubtitle:
          "Have a wholesale inquiry, custom packaging request, or product specification? Our export trade team in Sangli, India is ready to assist you.",

        headquartersBadge: "HEADQUARTERS",
        headquartersTitle: "Sangli, Maharashtra",
        headquartersAddress: "Flat No 5, Rahul App., Nagaraj Colony 100Ft Street, Vishrambag, Sangli 416416.",
        headquartersMapUrl: "https://maps.google.com/?q=Nagaraj+Colony+100Ft+Street+Vishrambag+Sangli+416416",

        phoneBadge: "CALL & WHATSAPP",
        phoneTitle: "Trade Desk Line",
        phoneNumber: "+91 88067 37015",
        phoneHours: "Mon – Sat: 9:00 AM – 7:00 PM IST",
        phoneCallHref: "tel:+918806737015",
        whatsappNumber: "918806737015",

        emailBadge: "OFFICIAL EMAIL",
        emailTitle: "Quotes & Specs",
        primaryEmail: "info.vrushahiimpex@vrushahi.com",
        secondaryEmail: "vrushahiimpex@gmail.com",

        formBadge: "EXPLICIT EXPORT INQUIRY",
        formTitle: "Send an Export Pricing & Specs Request",
        formSubtitle:
          "Fill in your required product category, estimated quantity, and port destination. Our exports manager will contact you with wholesale pricing & COA parameters.",

        enquirySupportTitle: "Direct Export Support",
        enquirySupportSubtitle: "Partner with Vrushahi Impex for seamless global trade & bulk supplies.",
        enquirySupportFeatures: defaultFeatures,
        enquiryTradeDeskTitle: "TRADE DESK CONTACT",
        enquiryTradeDeskPhone: "+91 88067 37015",
        enquiryTradeDeskEmail: "info.vrushahiimpex@vrushahi.com",
        enquiryTradeDeskLocation: "Sangli, Maharashtra, India",

        faqBadge: "FREQUENTLY ASKED QUESTIONS",
        faqTitle: "Export Trade Guidance for Global Buyers",
        faqSubtitle: "Common questions answered regarding ordering, port logistics, payment security, and custom specifications.",
        faqs: defaultFaqs,
      });
    } else {
      contactUs.heroBadge = contactUs.heroBadge || "DIRECT GLOBAL EXPORT SUPPORT";
      contactUs.heroTitle = contactUs.heroTitle || "Connect With Our Export Desk";
      contactUs.heroSubtitle =
        contactUs.heroSubtitle ||
        "Have a wholesale inquiry, custom packaging request, or product specification? Our export trade team in Sangli, India is ready to assist you.";

      contactUs.headquartersBadge = contactUs.headquartersBadge || "HEADQUARTERS";
      contactUs.headquartersTitle = contactUs.headquartersTitle || "Sangli, Maharashtra";
      contactUs.headquartersAddress =
        contactUs.headquartersAddress ||
        "Flat No 5, Rahul App., Nagaraj Colony 100Ft Street, Vishrambag, Sangli 416416.";
      contactUs.headquartersMapUrl =
        contactUs.headquartersMapUrl ||
        "https://maps.google.com/?q=Nagaraj+Colony+100Ft+Street+Vishrambag+Sangli+416416";

      contactUs.phoneBadge = contactUs.phoneBadge || "CALL & WHATSAPP";
      contactUs.phoneTitle = contactUs.phoneTitle || "Trade Desk Line";
      contactUs.phoneNumber = contactUs.phoneNumber || "+91 88067 37015";
      contactUs.phoneHours = contactUs.phoneHours || "Mon – Sat: 9:00 AM – 7:00 PM IST";
      contactUs.phoneCallHref = contactUs.phoneCallHref || "tel:+918806737015";
      contactUs.whatsappNumber = contactUs.whatsappNumber || "918806737015";

      contactUs.emailBadge = contactUs.emailBadge || "OFFICIAL EMAIL";
      contactUs.emailTitle = contactUs.emailTitle || "Quotes & Specs";
      contactUs.primaryEmail = contactUs.primaryEmail || "info.vrushahiimpex@vrushahi.com";
      contactUs.secondaryEmail = contactUs.secondaryEmail || "vrushahiimpex@gmail.com";

      contactUs.formBadge = contactUs.formBadge || "EXPLICIT EXPORT INQUIRY";
      contactUs.formTitle = contactUs.formTitle || "Send an Export Pricing & Specs Request";
      contactUs.formSubtitle =
        contactUs.formSubtitle ||
        "Fill in your required product category, estimated quantity, and port destination. Our exports manager will contact you with wholesale pricing & COA parameters.";

      contactUs.enquirySupportTitle = contactUs.enquirySupportTitle || "Direct Export Support";
      contactUs.enquirySupportSubtitle =
        contactUs.enquirySupportSubtitle || "Partner with Vrushahi Impex for seamless global trade & bulk supplies.";
      if (!contactUs.enquirySupportFeatures || contactUs.enquirySupportFeatures.length === 0) {
        contactUs.enquirySupportFeatures = defaultFeatures;
      }
      contactUs.enquiryTradeDeskTitle = contactUs.enquiryTradeDeskTitle || "TRADE DESK CONTACT";
      contactUs.enquiryTradeDeskPhone = contactUs.enquiryTradeDeskPhone || "+91 88067 37015";
      contactUs.enquiryTradeDeskEmail = contactUs.enquiryTradeDeskEmail || "info.vrushahiimpex@vrushahi.com";
      contactUs.enquiryTradeDeskLocation = contactUs.enquiryTradeDeskLocation || "Sangli, Maharashtra, India";

      contactUs.faqBadge = contactUs.faqBadge || "FREQUENTLY ASKED QUESTIONS";
      contactUs.faqTitle = contactUs.faqTitle || "Export Trade Guidance for Global Buyers";
      contactUs.faqSubtitle =
        contactUs.faqSubtitle ||
        "Common questions answered regarding ordering, port logistics, payment security, and custom specifications.";

      // Always populate FAQs into database
      contactUs.faqs = defaultFaqs;
    }

    await contactUs.save();
    console.log("Successfully seeded FAQs and ContactUsPage data into MongoDB!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ContactUsPage:", error);
    process.exit(1);
  }
})();
