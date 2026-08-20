const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Enquiry = require("../models/Enquiry");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

async function runEndToEndTest() {
  console.log("==================================================");
  console.log("STARTING END-TO-END ENQUIRY FORM & DATABASE TEST");
  console.log("==================================================");

  // 1. Connect to MongoDB
  console.log("\n[1/5] Connecting to MongoDB database...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✓ MongoDB Connected successfully!");

  const testEmail = `e2e_test_${Date.now()}@example.com`;
  let createdEnquiryIds = [];

  try {
    // 2. Test Contact Form Submission (JSON payload)
    console.log("\n[2/5] Testing Contact Form Submission (JSON format)...");
    const contactPayload = {
      type: "contact",
      name: "E2E Test User Contact",
      email: testEmail,
      phone: "+91 9876543210",
      category: "General Export Bulk Requirement",
      message: "This is an automated E2E test message for contact form.",
    };

    const contactRes = await fetch("http://localhost:5000/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactPayload),
    });

    const contactJson = await contactRes.json();
    console.log("Contact submission HTTP Status:", contactRes.status);
    console.log("Response payload:", contactJson);

    if (contactRes.status !== 201 || !contactJson.success) {
      throw new Error(`Contact form submission failed: ${JSON.stringify(contactJson)}`);
    }

    const contactDbRecord = await Enquiry.findById(contactJson.data._id);
    if (!contactDbRecord) {
      throw new Error("Contact submission not found in database!");
    }
    console.log("✓ Contact Form entry verified in MongoDB database:");
    console.log({
      id: contactDbRecord._id.toString(),
      type: contactDbRecord.type,
      name: contactDbRecord.name,
      email: contactDbRecord.email,
      phone: contactDbRecord.phone,
      category: contactDbRecord.category,
      message: contactDbRecord.message,
      status: contactDbRecord.status,
    });
    createdEnquiryIds.push(contactDbRecord._id);

    // 3. Test Product Enquiry Form Submission (Multipart/FormData with attachments)
    console.log("\n[3/5] Testing Product Enquiry Form Submission (Multipart/FormData with PDF attachment)...");

    // Create a dummy pdf file for testing attachment upload
    const dummyPdfPath = path.join(__dirname, "temp_test_doc.pdf");
    fs.writeFileSync(dummyPdfPath, "%PDF-1.4 sample test document for e2e testing");

    const formData = new FormData();
    formData.append("type", "enquiry");
    formData.append("name", "Ajay Panchal (E2E Test)");
    formData.append("email", testEmail);
    formData.append("phone", "7610416911");
    formData.append("website", "https://www.google.com");
    formData.append("address", "Dewas, MP, India");
    formData.append("category", "Dry Fruits");
    formData.append("message", "This is an automated E2E test message with document attachment.");

    const pdfBlob = new Blob([fs.readFileSync(dummyPdfPath)], { type: "application/pdf" });
    formData.append("attachments", pdfBlob, "Test_Spec_Sheet.pdf");

    const enquiryRes = await fetch("http://localhost:5000/api/enquiries", {
      method: "POST",
      body: formData,
    });

    const enquiryJson = await enquiryRes.json();
    console.log("Enquiry submission HTTP Status:", enquiryRes.status);
    console.log("Response payload:", enquiryJson);

    // Clean up temporary local test pdf file
    if (fs.existsSync(dummyPdfPath)) fs.unlinkSync(dummyPdfPath);

    if (enquiryRes.status !== 201 || !enquiryJson.success) {
      throw new Error(`Product enquiry submission failed: ${JSON.stringify(enquiryJson)}`);
    }

    const enquiryDbRecord = await Enquiry.findById(enquiryJson.data._id);
    if (!enquiryDbRecord) {
      throw new Error("Product enquiry submission not found in database!");
    }
    console.log("✓ Product Enquiry entry verified in MongoDB database:");
    console.log({
      id: enquiryDbRecord._id.toString(),
      type: enquiryDbRecord.type,
      name: enquiryDbRecord.name,
      email: enquiryDbRecord.email,
      phone: enquiryDbRecord.phone,
      website: enquiryDbRecord.website,
      address: enquiryDbRecord.address,
      category: enquiryDbRecord.category,
      message: enquiryDbRecord.message,
      attachments: enquiryDbRecord.attachments,
      status: enquiryDbRecord.status,
    });
    createdEnquiryIds.push(enquiryDbRecord._id);

    // 4. Test Fetching Enquiries via Admin API
    console.log("\n[4/5] Testing Admin Retrieval API for Enquiries...");
    // Find or create admin user to get JWT token
    const adminUser = await Admin.findOne({ email: process.env.ADMIN_EMAIL || "panchalajay717@gmail.com" });
    if (!adminUser) {
      throw new Error("Admin user not found in DB. Run seedAdmin first.");
    }
    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const fetchRes = await fetch("http://localhost:5000/api/enquiries?type=enquiry", {
      headers: { Cookie: `token=${token}` },
    });
    const fetchJson = await fetchRes.json();
    console.log("Admin API HTTP Status:", fetchRes.status);
    if (fetchRes.status !== 200 || !fetchJson.success) {
      throw new Error(`Admin fetch failed: ${JSON.stringify(fetchJson)}`);
    }
    const foundInAdminList = fetchJson.data.some((item) => item._id.toString() === enquiryDbRecord._id.toString());
    console.log(`✓ Created enquiry visible in Admin Panel list: ${foundInAdminList}`);

    // 5. Cleanup Test Records
    console.log("\n[5/5] Cleaning up test data from MongoDB...");
    await Enquiry.deleteMany({ _id: { $in: createdEnquiryIds } });
    console.log("✓ Test records deleted cleanly from database.");

    console.log("\n==================================================");
    console.log("🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY!");
    console.log("Form data stores properly in database and works end to end!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ E2E TEST FAILED:", err.message);
    if (createdEnquiryIds.length) {
      await Enquiry.deleteMany({ _id: { $in: createdEnquiryIds } });
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runEndToEndTest();
