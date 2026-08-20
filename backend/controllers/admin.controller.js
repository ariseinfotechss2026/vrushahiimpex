const Category = require("../models/Category");
const Product = require("../models/Product");
const CategoryProduct = require("../models/CategoryProduct");
const BlogPost = require("../models/BlogPost");
const Enquiry = require("../models/Enquiry");
const asyncHandler = require("../utils/asyncHandler");

const getStats = asyncHandler(async (req, res) => {
  const targetYear = parseInt(req.query.year) || new Date().getFullYear();

  // Generate 12 calendar months for targetYear (Jan to Dec)
  const months = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let m = 0; m < 12; m++) {
    const startDate = new Date(targetYear, m, 1);
    const endDate = new Date(targetYear, m + 1, 1);
    months.push({
      month: monthNames[m],
      startDate,
      endDate,
    });
  }

  const [
    totalCategoryProducts,
    totalProducts,
    totalCategories,
    totalPosts,
    newEnquiries,
    newContactUs,
    contactedContactUs,
    closedContactUs,
    newProductEnquiry,
    contactedProductEnquiry,
    closedProductEnquiry,
    recentEnquiries,
    monthlyTimeline,
  ] = await Promise.all([
    CategoryProduct.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    BlogPost.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({ type: "contact", status: "new" }),
    Enquiry.countDocuments({ type: "contact", status: "contacted" }),
    Enquiry.countDocuments({ type: "contact", status: "closed" }),
    Enquiry.countDocuments({ type: "enquiry", status: "new" }),
    Enquiry.countDocuments({ type: "enquiry", status: "contacted" }),
    Enquiry.countDocuments({ type: "enquiry", status: "closed" }),
    Enquiry.find().sort({ createdAt: -1 }).limit(5),
    Promise.all(
      months.map(async (m) => {
        const [productEnquiryCount, contactUsCount] = await Promise.all([
          Enquiry.countDocuments({
            type: "enquiry",
            createdAt: { $gte: m.startDate, $lt: m.endDate },
          }),
          Enquiry.countDocuments({
            type: "contact",
            createdAt: { $gte: m.startDate, $lt: m.endDate },
          }),
        ]);
        return {
          month: m.month,
          "Product Enquiry": productEnquiryCount,
          "Contact Us": contactUsCount,
        };
      })
    ),
  ]);

  res.json({
    success: true,
    data: {
      totalCategoryProducts,
      totalProducts,
      totalCategories,
      totalPosts,
      newEnquiries,
      newContactUs,
      contactedContactUs,
      closedContactUs,
      newProductEnquiry,
      contactedProductEnquiry,
      closedProductEnquiry,
      recentEnquiries,
      monthlyTimeline,
      selectedYear: targetYear,
    },
  });
});

module.exports = { getStats };
