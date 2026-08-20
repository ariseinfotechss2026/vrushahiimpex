const FooterSettings = require("../models/FooterSettings");
const asyncHandler = require("../utils/asyncHandler");

const getFooterSettings = asyncHandler(async (req, res) => {
  const settings = await FooterSettings.getSingleton();
  res.json({ success: true, data: settings });
});

const updateFooterSettings = asyncHandler(async (req, res) => {
  const settings = await FooterSettings.getSingleton();

  const {
    brandDescription,
    facebookUrl,
    showFacebook,
    instagramUrl,
    showInstagram,
    linkedinUrl,
    showLinkedin,
    youtubeUrl,
    showYoutube,
    contactPhone,
    contactPhoneHref,
    contactEmail,
    contactAddress,
    copyrightText,
    privacyText,
    privacyUrl,
    termsText,
    termsUrl,
  } = req.body;

  if (brandDescription !== undefined) settings.brandDescription = brandDescription;
  if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;
  if (showFacebook !== undefined) settings.showFacebook = Boolean(showFacebook);
  if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
  if (showInstagram !== undefined) settings.showInstagram = Boolean(showInstagram);
  if (linkedinUrl !== undefined) settings.linkedinUrl = linkedinUrl;
  if (showLinkedin !== undefined) settings.showLinkedin = Boolean(showLinkedin);
  if (youtubeUrl !== undefined) settings.youtubeUrl = youtubeUrl;
  if (showYoutube !== undefined) settings.showYoutube = Boolean(showYoutube);

  if (contactPhone !== undefined) settings.contactPhone = contactPhone;
  if (contactPhoneHref !== undefined) settings.contactPhoneHref = contactPhoneHref;
  if (contactEmail !== undefined) settings.contactEmail = contactEmail;
  if (contactAddress !== undefined) settings.contactAddress = contactAddress;

  if (copyrightText !== undefined) settings.copyrightText = copyrightText;
  if (privacyText !== undefined) settings.privacyText = privacyText;
  if (privacyUrl !== undefined) settings.privacyUrl = privacyUrl;
  if (termsText !== undefined) settings.termsText = termsText;
  if (termsUrl !== undefined) settings.termsUrl = termsUrl;

  await settings.save();
  res.json({ success: true, data: settings });
});

module.exports = { getFooterSettings, updateFooterSettings };
