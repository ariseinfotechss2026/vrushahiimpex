// Inserts Cloudinary's auto-format/auto-quality + responsive width transform into a
// secure_url. No-ops for anything that isn't a Cloudinary URL (e.g. local dev assets).
export function cloudinaryUrl(url: string | undefined | null, width = 600): string | undefined {
  if (!url || !url.trim()) return undefined
  if (!url.includes("res.cloudinary.com")) return url
  if (url.includes("/upload/f_auto,q_auto")) {
    return url.replace(/\/upload\/f_auto,q_auto,w_\d+\//, `/upload/f_auto,q_auto,w_${width}/`)
  }
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`)
}

