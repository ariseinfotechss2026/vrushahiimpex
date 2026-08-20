const ContactUsPage = require("../models/ContactUsPage");
const asyncHandler = require("../utils/asyncHandler");

const getContactUsPage = asyncHandler(async (req, res) => {
  const page = await ContactUsPage.getSingleton();
  res.json({ success: true, data: page });
});

const updateContactUsPage = asyncHandler(async (req, res) => {
  const page = await ContactUsPage.getSingleton();

  const {
    heroBadge,
    heroTitle,
    heroSubtitle,
    headquartersBadge,
    headquartersTitle,
    headquartersAddress,
    headquartersMapUrl,
    phoneBadge,
    phoneTitle,
    phoneNumber,
    phoneHours,
    phoneCallHref,
    whatsappNumber,
    emailBadge,
    emailTitle,
    primaryEmail,
    secondaryEmail,
    formBadge,
    formTitle,
    formSubtitle,
    faqBadge,
    faqTitle,
    faqSubtitle,
    faqs,
    enquirySupportTitle,
    enquirySupportSubtitle,
    enquirySupportFeatures,
    enquiryTradeDeskTitle,
    enquiryTradeDeskPhone,
    enquiryTradeDeskEmail,
    enquiryTradeDeskLocation,
  } = req.body;

  if (heroBadge !== undefined) page.heroBadge = heroBadge;
  if (heroTitle !== undefined) page.heroTitle = heroTitle;
  if (heroSubtitle !== undefined) page.heroSubtitle = heroSubtitle;

  if (headquartersBadge !== undefined) page.headquartersBadge = headquartersBadge;
  if (headquartersTitle !== undefined) page.headquartersTitle = headquartersTitle;
  if (headquartersAddress !== undefined) page.headquartersAddress = headquartersAddress;
  if (headquartersMapUrl !== undefined) page.headquartersMapUrl = headquartersMapUrl;

  if (phoneBadge !== undefined) page.phoneBadge = phoneBadge;
  if (phoneTitle !== undefined) page.phoneTitle = phoneTitle;
  if (phoneNumber !== undefined) page.phoneNumber = phoneNumber;
  if (phoneHours !== undefined) page.phoneHours = phoneHours;
  if (phoneCallHref !== undefined) page.phoneCallHref = phoneCallHref;
  if (whatsappNumber !== undefined) page.whatsappNumber = whatsappNumber;

  if (emailBadge !== undefined) page.emailBadge = emailBadge;
  if (emailTitle !== undefined) page.emailTitle = emailTitle;
  if (primaryEmail !== undefined) page.primaryEmail = primaryEmail;
  if (secondaryEmail !== undefined) page.secondaryEmail = secondaryEmail;

  if (formBadge !== undefined) page.formBadge = formBadge;
  if (formTitle !== undefined) page.formTitle = formTitle;
  if (formSubtitle !== undefined) page.formSubtitle = formSubtitle;

  if (enquirySupportTitle !== undefined) page.enquirySupportTitle = enquirySupportTitle;
  if (enquirySupportSubtitle !== undefined) page.enquirySupportSubtitle = enquirySupportSubtitle;
  if (enquirySupportFeatures !== undefined) {
    page.enquirySupportFeatures =
      typeof enquirySupportFeatures === "string" ? JSON.parse(enquirySupportFeatures) : enquirySupportFeatures;
  }
  if (enquiryTradeDeskTitle !== undefined) page.enquiryTradeDeskTitle = enquiryTradeDeskTitle;
  if (enquiryTradeDeskPhone !== undefined) page.enquiryTradeDeskPhone = enquiryTradeDeskPhone;
  if (enquiryTradeDeskEmail !== undefined) page.enquiryTradeDeskEmail = enquiryTradeDeskEmail;
  if (enquiryTradeDeskLocation !== undefined) page.enquiryTradeDeskLocation = enquiryTradeDeskLocation;

  if (faqBadge !== undefined) page.faqBadge = faqBadge;
  if (faqTitle !== undefined) page.faqTitle = faqTitle;
  if (faqSubtitle !== undefined) page.faqSubtitle = faqSubtitle;

  if (faqs !== undefined) {
    page.faqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
  }

  await page.save();
  res.json({ success: true, data: page });
});

module.exports = { getContactUsPage, updateContactUsPage };
