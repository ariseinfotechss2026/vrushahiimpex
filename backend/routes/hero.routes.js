const express = require("express");
const { protect } = require("../middleware/auth");
const { imageUpload, videoUpload } = require("../middleware/upload");
const { getHeroItems, createHeroItem, updateHeroItem, deleteHeroItem } = require("../controllers/hero.controller");
const {
  getHeroVideos,
  createHeroVideo,
  setActiveHeroVideo,
  deleteHeroVideo,
} = require("../controllers/heroVideo.controller");

const router = express.Router();

// Hero Card items
router.get("/", getHeroItems);
router.post("/", protect, imageUpload.any(), createHeroItem);
router.put("/:id", protect, imageUpload.any(), updateHeroItem);
router.delete("/:id", protect, deleteHeroItem);

// Background Videos
router.get("/videos", getHeroVideos);
router.post("/videos", protect, videoUpload.single("video"), createHeroVideo);
router.patch("/videos/:id/active", protect, setActiveHeroVideo);
router.delete("/videos/:id", protect, deleteHeroVideo);

module.exports = router;
