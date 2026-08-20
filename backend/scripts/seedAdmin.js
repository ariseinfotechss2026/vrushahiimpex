// Creates/updates the single admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env.
// Safe to re-run: upserts by email.
require("dotenv").config({ quiet: true });
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

(async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before seeding.");
    process.exit(1);
  }

  await connectDB();

  const name = process.env.ADMIN_NAME || "Admin";
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { name, email: email.toLowerCase().trim(), passwordHash },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${admin.email}`);
  await mongoose.disconnect();
  process.exit(0);
})();
