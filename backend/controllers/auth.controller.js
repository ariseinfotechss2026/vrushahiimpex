const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw apiError(400, "Email and password are required");

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) throw apiError(401, "Invalid credentials");

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) throw apiError(401, "Invalid credentials");

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, COOKIE_OPTIONS);
  res.json({ success: true, data: { id: admin._id, name: admin.name, email: admin.email } });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ success: true, data: null });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { id: req.admin._id, name: req.admin.name, email: req.admin.email } });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw apiError(400, "Current and new password are required");
  if (newPassword.length < 8) throw apiError(400, "New password must be at least 8 characters");

  const admin = await Admin.findById(req.admin._id);
  const match = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!match) throw apiError(401, "Current password is incorrect");

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await admin.save();
  res.json({ success: true, data: null });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const admin = await Admin.findById(req.admin._id);
  if (!admin) throw apiError(404, "Admin account not found");

  if (name) admin.name = name.trim();
  if (email && email.toLowerCase().trim() !== admin.email) {
    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) throw apiError(400, "Email is already registered");
    admin.email = email.toLowerCase().trim();
  }

  await admin.save();
  res.json({ success: true, data: { id: admin._id, name: admin.name, email: admin.email } });
});

module.exports = { login, logout, me, updatePassword, updateProfile };

