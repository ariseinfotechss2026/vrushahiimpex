const LegalPage = require("../models/LegalPage");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get legal page data by slug
// @route   GET /api/legal/:slug
// @access  Public
const getLegalPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!["terms-and-conditions", "privacy-policy"].includes(slug)) {
    return res.status(404).json({ success: false, message: "Invalid legal page slug" });
  }

  const page = await LegalPage.getSingletonBySlug(slug);
  res.json({ success: true, data: page });
});

// @desc    Update legal page data by slug
// @route   PUT /api/legal/:slug
// @access  Private/Admin
const updateLegalPage = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!["terms-and-conditions", "privacy-policy"].includes(slug)) {
    return res.status(404).json({ success: false, message: "Invalid legal page slug" });
  }

  let page = await LegalPage.getSingletonBySlug(slug);

  const { badge, title, subtitle, lastUpdated, seoDescription, sections } = req.body;

  if (badge !== undefined) page.badge = badge;
  if (title !== undefined) page.title = title;
  if (subtitle !== undefined) page.subtitle = subtitle;
  if (lastUpdated !== undefined) page.lastUpdated = lastUpdated;
  if (seoDescription !== undefined) page.seoDescription = seoDescription;

  if (Array.isArray(sections)) {
    page.sections = sections.map((sec) => ({
      heading: sec.heading || "",
      body: sec.body || "",
    }));
  }

  await page.save();
  res.json({ success: true, data: page });
});

module.exports = {
  getLegalPage,
  updateLegalPage,
};
