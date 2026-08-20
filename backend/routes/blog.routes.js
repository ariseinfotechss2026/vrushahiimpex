const express = require("express");
const { protect } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");
const {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require("../controllers/blog.controller");

const router = express.Router();

router.get("/", getBlogPosts);
router.get("/:slug", getBlogPostBySlug);
router.post("/", protect, imageUpload.single("image"), createBlogPost);
router.put("/:id", protect, imageUpload.single("image"), updateBlogPost);
router.delete("/:id", protect, deleteBlogPost);

module.exports = router;
