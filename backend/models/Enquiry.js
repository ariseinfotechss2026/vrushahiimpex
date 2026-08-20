const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["contact", "enquiry"], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String },
    website: { type: String },
    address: { type: String },
    message: { type: String, required: true },
    attachments: [
      {
        url: String,
        filename: String,
        _id: false,
      },
    ],
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
