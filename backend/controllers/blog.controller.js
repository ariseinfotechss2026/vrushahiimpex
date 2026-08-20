const BlogPost = require("../models/BlogPost");
const asyncHandler = require("../utils/asyncHandler");
const apiError = require("../utils/apiError");
const slugify = require("../utils/slugify");
const { streamUpload, deleteImage } = require("../utils/cloudinaryUpload");

const getBlogPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find().sort({ date: -1 });
  res.json({ success: true, data: posts });
});

const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug });
  if (!post) throw apiError(404, "Blog post not found");
  res.json({ success: true, data: post });
});

const createBlogPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, readTime, author, date } = req.body;
  if (!title || !excerpt || !content || !author)
    throw apiError(400, "Title, excerpt, content, and author are required");

  const post = new BlogPost({
    title,
    slug: slugify(title),
    excerpt,
    content,
    category: category || "General",
    readTime: readTime || "3 min read",
    author,
    date: date || Date.now(),
  });
  if (req.file) post.image = await streamUpload(req.file.buffer, "blog");
  await post.save();
  res.status(201).json({ success: true, data: post });
});

const updateBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw apiError(404, "Blog post not found");

  const { title, excerpt, content, category, readTime, author, date } = req.body;
  if (title) {
    post.title = title;
    post.slug = slugify(title);
  }
  if (excerpt) post.excerpt = excerpt;
  if (content) post.content = content;
  if (category) post.category = category;
  if (readTime) post.readTime = readTime;
  if (author) post.author = author;
  if (date) post.date = date;

  if (req.file) {
    const oldPublicId = post.image?.public_id;
    post.image = await streamUpload(req.file.buffer, "blog");
    if (oldPublicId) deleteImage(oldPublicId);
  }

  await post.save();
  res.json({ success: true, data: post });
});

const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) throw apiError(404, "Blog post not found");

  await post.deleteOne();
  if (post.image?.public_id) deleteImage(post.image.public_id);
  res.json({ success: true, data: null });
});

module.exports = { getBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost };
