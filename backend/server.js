require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const path = require("path");
const compression = require("compression");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(compression());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS — allow configured client origin(s) with robust origin normalization
const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,https://vrushahiimpex.com,https://www.vrushahiimpex.com"
)
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Strip MongoDB operators ($, .) from user input to prevent NoSQL injection (fixes CRIT-03)
app.use(mongoSanitize());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: "30d",
    immutable: true,
    etag: true,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
    },
  })
);

// Global rate limit — 300 req/15min per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Strict rate limit on login endpoint — prevents brute-force (fixes CRIT-04)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again in 15 minutes." },
});

const memoryCache = new Map();

// Clear in-memory cache on write operations (POST, PUT, PATCH, DELETE)
app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    memoryCache.clear();
  }
  next();
});

// Cache control & in-memory microsecond response cache for public GET API requests
app.use("/api", (req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/auth") && !req.path.startsWith("/admin") && !req.path.startsWith("/enquiries")) {
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    const cacheKey = req.originalUrl;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 60000) {
      return res.status(200).type("application/json").send(cached.body);
    }
    const originalSend = res.send.bind(res);
    res.send = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(cacheKey, { body, timestamp: Date.now() });
      }
      return originalSend(body);
    };
  }
  next();
});

app.get("/api/health", (req, res) => res.json({ success: true, message: "API running" }));

// Apply strict login rate limiter before auth routes (fixes CRIT-04)
app.use("/api/auth/login", loginLimiter);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/category-products", require("./routes/categoryProduct.routes"));
app.use("/api/blog", require("./routes/blog.routes"));
app.use("/api/hero", require("./routes/hero.routes"));
app.use("/api/enquiries", require("./routes/enquiry.routes"));
app.use("/api/settings", require("./routes/settings.routes"));
app.use("/api/about", require("./routes/aboutCompany.routes"));
app.use("/api/about-us-page", require("./routes/aboutUsPage.routes"));
app.use("/api/contact-us-page", require("./routes/contactUsPage.routes"));
app.use("/api/footer-settings", require("./routes/footerSettings.routes"));
app.use("/api/legal", require("./routes/legalPage.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
