const Enquiry = require("../models/Enquiry");
const asyncHandler = require("../utils/asyncHandler");
const apiError = require("../utils/apiError");
const { sendMail, sendReplyMail } = require("../utils/mailer");
const { streamUpload } = require("../utils/cloudinaryUpload");
const path = require("path");
const fs = require("fs");

const createEnquiry = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const type = (body.type || "enquiry").trim();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const category = (body.category || "").trim();
  const website = (body.website || "").trim();
  const address = (body.address || "").trim();
  const message = (body.message || "").trim();

  const missing = [];
  if (!name) missing.push("Name");
  if (!email) missing.push("Email");
  if (!phone) missing.push("Phone");
  if (!message) missing.push("Message");

  if (missing.length > 0) {
    throw apiError(400, `Please fill out required field(s): ${missing.join(", ")}`);
  }

  // Validate email format (HIGH-04)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw apiError(400, "Please enter a valid email address");
  }

  const attachmentFiles = req.files || [];
  const attachments = [];

  for (const f of attachmentFiles) {
    if (!f.originalname || !f.buffer) continue;

    const ext = path.extname(f.originalname).toLowerCase();
    const isImage = [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
    const resource_type = isImage ? "image" : "raw";

    try {
      // Upload file buffer to Cloudinary
      const uploaded = await streamUpload(f.buffer, "enquiries", {
        resource_type,
        use_filename: true,
        unique_filename: true,
      });
      attachments.push({ url: uploaded.url, filename: f.originalname });
    } catch (err) {
      console.warn(`Cloudinary upload failed for ${f.originalname}, storing locally fallback: ${err.message}`);
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const localFilename = `${Date.now()}-${f.originalname.replace(/\s+/g, "_")}`;
      const localPath = path.join(uploadsDir, localFilename);
      fs.writeFileSync(localPath, f.buffer);
      attachments.push({ url: `/uploads/${localFilename}`, filename: f.originalname });
    }
  }

  const enquiry = await Enquiry.create({
    type,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    category: category ? category.trim() : "",
    website: website ? website.trim() : "",
    address: address ? address.trim() : "",
    message: message.trim(),
    attachments,
  });

  sendMail({
    subject: `New ${type} submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCategory: ${category || "-"}\n\nMessage:\n${message}`,
  }).catch((err) => console.warn(`Email notification failed: ${err.message}`));

  res.status(201).json({ success: true, data: enquiry });
});

const getEnquiries = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    // Escape special regex characters to prevent ReDoS attacks (CRIT-03 / HIGH-06)
    const escapedSearch = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escapedSearch, "i");
    filter.$or = [{ name: re }, { email: re }];
  }

  const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: enquiries });
});

const getEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) throw apiError(404, "Enquiry not found");
  res.json({ success: true, data: enquiry });
});

const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["new", "contacted", "closed"].includes(status)) throw apiError(400, "Invalid status");

  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!enquiry) throw apiError(404, "Enquiry not found");
  res.json({ success: true, data: enquiry });
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw apiError(404, "Enquiry not found");
  res.json({ success: true, data: null });
});

const replyToEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subject, message } = req.body || {};

  if (!subject || !subject.trim()) throw apiError(400, "Subject is required");
  if (!message || !message.trim()) throw apiError(400, "Message body is required");

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) throw apiError(404, "Enquiry not found");
  if (!enquiry.email) throw apiError(400, "Recipient email address is missing on this enquiry");

  const formattedMessage = message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #059669; padding: 20px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">VRUSHAHI IMPEX</h1>
        <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Merchant Exporter & Global Trade Solutions</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff;">
        <p style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 0;">Dear ${enquiry.name},</p>
        <div style="font-size: 14px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          ${formattedMessage}
        </div>
        ${
          enquiry.message
            ? `<div style="margin-top: 24px; padding: 14px; background-color: #f9fafb; border-left: 4px solid #059669; border-radius: 4px; font-size: 13px; color: #6b7280;">
                <strong style="color: #374151;">Your Original Enquiry:</strong><br/>
                <span style="font-style: italic;">"${enquiry.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}"</span>
              </div>`
            : ""
        }
      </div>
      <div style="background-color: #f3f4f6; padding: 16px 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 4px 0;"><strong>Vrushahi Impex</strong> | Merchant Exporter</p>
        <p style="margin: 0;">This email is a direct response to your enquiry submitted on our portal.</p>
      </div>
    </div>
  `;

  try {
    await sendReplyMail({
      to: enquiry.email,
      subject: subject.trim(),
      text: message.trim(),
      html: htmlBody,
    });
  } catch (err) {
    throw apiError(500, `Failed to send email via SMTP: ${err.message}`);
  }

  if (enquiry.status === "new") {
    enquiry.status = "contacted";
    await enquiry.save();
  }

  res.json({
    success: true,
    message: `Reply email successfully sent to ${enquiry.email}`,
    data: enquiry,
  });
});

module.exports = { createEnquiry, getEnquiries, getEnquiry, updateEnquiryStatus, deleteEnquiry, replyToEnquiry };

