const SiteSettings = require("../models/SiteSettings");
const asyncHandler = require("../utils/asyncHandler");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  res.json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();

  const { name, tagline, phone, phoneHref, emails, addressLines, mapEmbedSrc, facebook, instagram, linkedin, logoUrl } =
    req.body;

  if (name !== undefined) settings.companyInfo.name = name;
  if (tagline !== undefined) settings.companyInfo.tagline = tagline;
  if (phone !== undefined) settings.companyInfo.phone = phone;
  if (phoneHref !== undefined) settings.companyInfo.phoneHref = phoneHref;
  if (emails !== undefined) {
    settings.companyInfo.emails = typeof emails === "string" ? emails.split(",").map((s) => s.trim()).filter(Boolean) : emails;
  }
  if (addressLines !== undefined) {
    settings.companyInfo.addressLines = typeof addressLines === "string" ? addressLines.split("\n").map((s) => s.trim()).filter(Boolean) : addressLines;
  }
  if (mapEmbedSrc !== undefined) settings.companyInfo.mapEmbedSrc = mapEmbedSrc;
  if (facebook !== undefined) settings.socialLinks.facebook = facebook;
  if (instagram !== undefined) settings.socialLinks.instagram = instagram;
  if (linkedin !== undefined) settings.socialLinks.linkedin = linkedin;

  if (req.file) {
    const oldPublicId = settings.companyInfo.logo?.public_id;
    settings.companyInfo.logo = await streamUpload(req.file.buffer, "settings");
    if (oldPublicId) deleteImage(oldPublicId);
  } else if (logoUrl !== undefined) {
    settings.companyInfo.logo = { url: logoUrl, public_id: "" };
  }

  await settings.save();
  res.json({ success: true, data: settings });
});

module.exports = { getSettings, updateSettings };
