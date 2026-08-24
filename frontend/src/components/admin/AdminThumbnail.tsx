import { useState, useEffect } from "react"
import { Package } from "lucide-react"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"
import { cn } from "@/lib/utils"

interface AdminThumbnailProps {
  src?: string | null
  alt: string
  className?: string
  width?: number
  icon?: React.ReactNode
}

export function AdminThumbnail({
  src,
  alt,
  className,
  width = 80,
  icon,
}: AdminThumbnailProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!src || !src.trim()) {
      setImgSrc(null)
      setHasError(true)
      return
    }

    setHasError(false)
    setIsLoaded(false)
    setRetryCount(0)
    // First try: Cloudinary transformed thumbnail URL
    const transformed = cloudinaryUrl(src, width)
    setImgSrc(transformed || src)
  }, [src, width])

  function handleError() {
    if (retryCount === 0 && src && imgSrc !== src) {
      // Retry once with the direct un-transformed URL (in case transform is still generating)
      setRetryCount(1)
      setImgSrc(src)
    } else {
      setHasError(true)
    }
  }

  if (hasError || !imgSrc) {
    return (
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground shadow-2xs",
          className
        )}
      >
        {icon || <Package className="size-5 opacity-60" />}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40 shadow-2xs",
        className
      )}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={cn(
          "size-full object-cover transition-opacity duration-200",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}
