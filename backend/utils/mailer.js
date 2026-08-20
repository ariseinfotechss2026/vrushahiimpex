const nodemailer = require("nodemailer");

const transporter =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    : null;

if (!transporter) console.warn("SMTP not configured — enquiry email notifications are disabled.");

// Never throws — a missing/broken mail config must not break the request that triggered it.
const sendMail = async ({ subject, text }) => {
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, to: process.env.NOTIFY_EMAIL, subject, text });
  } catch (err) {
    console.warn(`Email notification failed: ${err.message}`);
  }
};

/**
 * Send an email directly to a user/customer recipient via SMTP.
 * Throws an error if SMTP is not configured or if sending fails.
 */
const sendReplyMail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    throw new Error("SMTP is not configured in backend environment (.env). Please set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }
  const fromName = process.env.ADMIN_NAME || "Vrushahi Impex";
  const mailOptions = {
    from: `"${fromName}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, "<br>"),
  };
  return await transporter.sendMail(mailOptions);
};

module.exports = { sendMail, sendReplyMail };

