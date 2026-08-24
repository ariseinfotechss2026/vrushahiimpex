// Global in-memory cache tracking loaded images during the current browser session
export const loadedImagesCache = new Set<string>()

/**
 * Inserts Cloudinary auto-format (WebP/AVIF), auto-quality, and responsive width
 * transform into a secure_url. Safe no-op for local or non-Cloudinary assets.
 */
export function cloudinaryUrl(
  url: string | undefined | null,
  width = 600,
  quality: "auto" | "good" | "eco" | "best" = "good"
): string | undefined {
  if (!url || !url.trim()) return undefined
  if (!url.includes("res.cloudinary.com")) return url

  const transform = `f_auto,q_auto:${quality},c_limit,w_${width}`

  if (url.includes("/upload/f_auto,q_auto")) {
    return url.replace(/\/upload\/f_auto,q_auto[^/]*\//, `/upload/${transform}/`)
  }
  return url.replace("/upload/", `/upload/${transform}/`)
}

/**
 * Generates a responsive srcset string for Cloudinary images across standard breakpoints.
 */
export function cloudinarySrcSet(
  url: string | undefined | null,
  widths: number[] = [320, 480, 640, 800, 1024, 1200]
): string | undefined {
  if (!url || !url.trim() || !url.includes("res.cloudinary.com")) return undefined

  return widths
    .map((w) => {
      const transformedUrl = cloudinaryUrl(url, w)
      return `${transformedUrl} ${w}w`
    })
    .join(", ")
}

/**
 * Preloads an image into the browser cache ahead of user navigation.
 */
export function preloadImage(url: string | undefined | null, width?: number): Promise<void> {
  return new Promise((resolve) => {
    const targetUrl = width ? cloudinaryUrl(url, width) : url
    if (!targetUrl || loadedImagesCache.has(targetUrl)) {
      resolve()
      return
    }

    const img = new Image()
    img.src = targetUrl
    img.onload = () => {
      loadedImagesCache.add(targetUrl)
      resolve()
    }
    img.onerror = () => {
      resolve()
    }
  })
}

/**
 * Checks if an image is already in the loaded/session cache.
 */
export function isImageLoaded(url: string | undefined | null, width?: number): boolean {
  const targetUrl = width ? cloudinaryUrl(url, width) : url
  return !!targetUrl && loadedImagesCache.has(targetUrl)
}

