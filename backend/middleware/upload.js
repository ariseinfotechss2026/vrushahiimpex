const path = require("path");
const fs = require("fs");
const multer = require("multer");

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for background videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only video files (MP4/WebM) are allowed"));
  },
});

// Allowed MIME types for enquiry attachments (whitelist approach for security — CRIT-05)
const ALLOWED_ATTACHMENT_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const attachmentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 2 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname || file.originalname === "blob") {
      return cb(null, false);
    }
    if (!ALLOWED_ATTACHMENT_MIMES.has(file.mimetype)) {
      return cb(new Error("Only images (JPG, PNG, WebP), PDF, or Word documents are allowed as attachments"));
    }
    cb(null, true);
  },
});

module.exports = { imageUpload, videoUpload, attachmentUpload };
