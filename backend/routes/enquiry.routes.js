const express = require("express");
const { protect } = require("../middleware/auth");
const { attachmentUpload } = require("../middleware/upload");
const {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  replyToEnquiry,
} = require("../controllers/enquiry.controller");

const router = express.Router();

const handleAttachmentUpload = (req, res, next) => {
  attachmentUpload.array("attachments", 2)(req, res, (err) => {
    if (err) {
      if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: "File size exceeds 10MB limit per document." });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({ success: false, message: "Maximum 2 attachment files allowed." });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: err.message || "Invalid attachment file." });
    }
    next();
  });
};

router.post("/", handleAttachmentUpload, createEnquiry);
router.get("/", protect, getEnquiries);
router.get("/:id", protect, getEnquiry);
router.patch("/:id/status", protect, updateEnquiryStatus);
router.post("/:id/reply", protect, replyToEnquiry);
router.delete("/:id", protect, deleteEnquiry);

module.exports = router;
