const AboutUsPage = require("../models/AboutUsPage");
const asyncHandler = require("../utils/asyncHandler");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

const getAboutUsPage = asyncHandler(async (req, res) => {
  const page = await AboutUsPage.getSingleton();
  res.json({ success: true, data: page });
});

const updateAboutUsPage = asyncHandler(async (req, res) => {
  const page = await AboutUsPage.getSingleton();

  const {
    storyBadge,
    storyTitleLine1,
    storyTitleHighlight,
    storyParagraph1,
    storyParagraph2,
    certifications,
    heroImageCaptionTitle,
    heroImageCaptionSub,
    ctaButtonText,
    ctaButtonLink,
    standardsBadge,
    standardsTitle,
    standardsDescription,
    coreValues,
    missionTitle,
    missionDescription,
    visionTitle,
    visionDescription,
  } = req.body;

  if (storyBadge !== undefined) page.storyBadge = storyBadge;
  if (storyTitleLine1 !== undefined) page.storyTitleLine1 = storyTitleLine1;
  if (storyTitleHighlight !== undefined) page.storyTitleHighlight = storyTitleHighlight;
  if (storyParagraph1 !== undefined) page.storyParagraph1 = storyParagraph1;
  if (storyParagraph2 !== undefined) page.storyParagraph2 = storyParagraph2;
  if (certifications !== undefined) {
    page.certifications = typeof certifications === "string" ? JSON.parse(certifications) : certifications;
  }
  if (heroImageCaptionTitle !== undefined) page.heroImageCaptionTitle = heroImageCaptionTitle;
  if (heroImageCaptionSub !== undefined) page.heroImageCaptionSub = heroImageCaptionSub;
  if (ctaButtonText !== undefined) page.ctaButtonText = ctaButtonText;
  if (ctaButtonLink !== undefined) page.ctaButtonLink = ctaButtonLink;

  if (standardsBadge !== undefined) page.standardsBadge = standardsBadge;
  if (standardsTitle !== undefined) page.standardsTitle = standardsTitle;
  if (standardsDescription !== undefined) page.standardsDescription = standardsDescription;
  if (coreValues !== undefined) {
    page.coreValues = typeof coreValues === "string" ? JSON.parse(coreValues) : coreValues;
  }

  if (missionTitle !== undefined) page.missionTitle = missionTitle;
  if (missionDescription !== undefined) page.missionDescription = missionDescription;
  if (visionTitle !== undefined) page.visionTitle = visionTitle;
  if (visionDescription !== undefined) page.visionDescription = visionDescription;

  if (req.file) {
    const oldPublicId = page.heroImage?.public_id;
    page.heroImage = await streamUpload(req.file.buffer, "about-us");
    if (oldPublicId) deleteImage(oldPublicId);
  }

  await page.save();
  res.json({ success: true, data: page });
});

module.exports = { getAboutUsPage, updateAboutUsPage };
