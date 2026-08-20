const AboutCompany = require("../models/AboutCompany");
const asyncHandler = require("../utils/asyncHandler");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

const getAboutCompany = asyncHandler(async (req, res) => {
  const about = await AboutCompany.getSingleton();
  res.json({ success: true, data: about });
});

const updateAboutCompany = asyncHandler(async (req, res) => {
  const about = await AboutCompany.getSingleton();
  const { badge, title, highlightWord, leadText, bodyText, buttonText, buttonLink } = req.body;

  if (badge !== undefined) about.badge = badge;
  if (title !== undefined) about.title = title;
  if (highlightWord !== undefined) about.highlightWord = highlightWord;
  if (leadText !== undefined) about.leadText = leadText;
  if (bodyText !== undefined) about.bodyText = bodyText;
  if (buttonText !== undefined) about.buttonText = buttonText;
  if (buttonLink !== undefined) about.buttonLink = buttonLink;

  // Handle images update if existingImages parameter is sent
  if (req.body.existingImages !== undefined) {
    const existing = JSON.parse(req.body.existingImages || "[]");
    const newMeta = JSON.parse(req.body.newImagesMeta || "[]");
    const files = req.files || [];

    const fileByIndex = Object.fromEntries(
      files
        .filter((f) => f.fieldname.startsWith("new_image_"))
        .map((f) => [f.fieldname.split("_")[2], f])
    );

    const uploadedImages = [];
    for (let i = 0; i < newMeta.length; i++) {
      const file = fileByIndex[String(i)] || files[i];
      if (file) {
        const uploaded = await streamUpload(file.buffer, "about");
        uploadedImages.push({
          url: uploaded.url,
          public_id: uploaded.public_id,
          alt: newMeta[i]?.alt || "",
        });
      }
    }

    const finalImages = [...existing, ...uploadedImages];

    // Clean up deleted Cloudinary images
    const keptPublicIds = new Set(finalImages.map((img) => img.public_id).filter(Boolean));
    about.images.forEach((img) => {
      if (img.public_id && !keptPublicIds.has(img.public_id)) {
        deleteImage(img.public_id);
      }
    });

    about.images = finalImages;
  }

  await about.save();
  res.json({ success: true, data: about });
});

module.exports = { getAboutCompany, updateAboutCompany };
