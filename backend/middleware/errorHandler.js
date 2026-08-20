const notFound = (req, res, next) => {
  // In production, don't leak the attempted path (prevents API enumeration)
  const message =
    process.env.NODE_ENV === "production"
      ? "Resource not found"
      : `Route not found: ${req.originalUrl}`;
  res.status(404).json({ success: false, message });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  let status = err.statusCode || err.status;

  if (!status) {
    if (
      err.name === "ValidationError" ||
      err.name === "CastError" ||
      err.name === "MulterError" ||
      (err.message && err.message.includes("allowed"))
    ) {
      status = 400;
    } else {
      status = 500;
    }
  }

  res.status(status).json({ success: false, message: err.message || "Server error" });
};

module.exports = { notFound, errorHandler };
