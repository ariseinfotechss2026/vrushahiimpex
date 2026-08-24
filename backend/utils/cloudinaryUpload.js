const cloudinary = require("../config/cloudinary");

const streamUpload = (buffer, folder, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `vrushahi/${folder}`,
      resource_type: options.resource_type || "auto",
      fetch_format: options.resource_type === "video" ? undefined : "auto",
      quality: options.resource_type === "video" ? undefined : "auto:good",
      timeout: 60000,
      ...options,
    };
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);
      resolve({ url: result.secure_url, public_id: result.public_id });
    });
    stream.end(buffer);
  });

// Best-effort — never blocks a response on Cloudinary being slow/down.
const deleteImage = async (public_id, options = {}) => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id, options);
  } catch (err) {
    console.warn(`Cloudinary delete failed for ${public_id}: ${err.message}`);
  }
};

module.exports = { streamUpload, deleteImage };
