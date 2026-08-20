const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throw apiError(401, "Not authenticated");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw apiError(401, "Invalid or expired session");
  }

  const admin = await Admin.findById(payload.id).select("-passwordHash");
  if (!admin) throw apiError(401, "Not authenticated");

  req.admin = admin;
  next();
});

module.exports = { protect };
