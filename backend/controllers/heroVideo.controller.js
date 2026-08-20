const HeroVideo = require("../models/HeroVideo");
const asyncHandler = require("../utils/asyncHandler");
const apiError = require("../utils/apiError");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

let cachedHeroVideos = null;

const invalidateHeroVideoCache = () => {
  cachedHeroVideos = null;
};

const getHeroVideos = asyncHandler(async (req, res) => {
  if (cachedHeroVideos) {
    return res.json({ success: true, data: cachedHeroVideos });
  }
  const videos = await HeroVideo.find().sort({ createdAt: -1 }).lean();
  cachedHeroVideos = videos;
  res.json({ success: true, data: videos });
});

const createHeroVideo = asyncHandler(async (req, res) => {
  const { title, videoUrl, isActive } = req.body;
  if (!title) throw apiError(400, "Title is required");

  let finalUrl = videoUrl ? videoUrl.trim() : "";
  let public_id = "";

  if (req.file) {
    const uploaded = await streamUpload(req.file.buffer, "hero/videos", { resource_type: "video" });
    finalUrl = uploaded.url;
    public_id = uploaded.public_id;
  }

  if (!finalUrl) {
    throw apiError(400, "Either upload a video file or provide a video URL");
  }

  const existingCount = await HeroVideo.countDocuments();
  const shouldMakeActive = isActive === "true" || isActive === true || existingCount === 0;

  if (shouldMakeActive) {
    await HeroVideo.updateMany({}, { isActive: false });
  }

  const video = new HeroVideo({
    title,
    videoUrl: finalUrl,
    public_id,
    isActive: shouldMakeActive,
  });

  await video.save();
  invalidateHeroVideoCache();
  res.status(201).json({ success: true, data: video });
});

const setActiveHeroVideo = asyncHandler(async (req, res) => {
  const video = await HeroVideo.findById(req.params.id);
  if (!video) throw apiError(404, "Hero background video not found");

  // Deactivate all videos first to enforce single active video rule
  await HeroVideo.updateMany({}, { isActive: false });

  // Activate selected video
  video.isActive = true;
  await video.save();
  invalidateHeroVideoCache();

  const allVideos = await HeroVideo.find().sort({ createdAt: -1 });
  res.json({ success: true, data: allVideos });
});

const deleteHeroVideo = asyncHandler(async (req, res) => {
  const video = await HeroVideo.findById(req.params.id);
  if (!video) throw apiError(404, "Hero background video not found");

  const wasActive = video.isActive;
  if (video.public_id) {
    await deleteImage(video.public_id, { resource_type: "video" });
  }
  await video.deleteOne();

  // If deleted video was active, make the latest remaining video active
  if (wasActive) {
    const latest = await HeroVideo.findOne().sort({ createdAt: -1 });
    if (latest) {
      latest.isActive = true;
      await latest.save();
    }
  }
  invalidateHeroVideoCache();

  res.json({ success: true, data: null });
});

module.exports = {
  getHeroVideos,
  createHeroVideo,
  setActiveHeroVideo,
  deleteHeroVideo,
};
