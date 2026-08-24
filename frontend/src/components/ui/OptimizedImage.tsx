import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { cloudinaryUrl, cloudinarySrcSet, loadedImagesCache } from "@/lib/cloudinaryUrl"
import { ImageIcon } from "lucide-react"

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt: string
  targetWidth?: number
  quality?: "auto" | "good" | "eco" | "best"
  srcSetWidths?: number[]
  priority?: boolean
  containerClassName?: string
  aspectRatioClassName?: string
  fallbackSrc?: string
  showSkeleton?: boolean
}

export function OptimizedImage({
  src,
  alt,
  targetWidth = 600,
  quality = "good",
  srcSetWidths,
  priority = false,
  className,
  containerClassName,
  aspectRatioClassName,
  fallbackSrc,
  showSkeleton = true,
  loading,
  decoding,
  fetchPriority,
  sizes,
  ...props
}: OptimizedImageProps) {
  const optimizedSrc = cloudinaryUrl(src, targetWidth, quality) || fallbackSrc || ""
  const srcSet = srcSetWidths ? cloudinarySrcSet(src, srcSetWidths) : undefined

  // Check if image is already cached in browser session
  const isAlreadyLoaded = optimizedSrc ? loadedImagesCache.has(optimizedSrc) : false

  const [isLoaded, setIsLoaded] = useState(isAlreadyLoaded)
  const [hasError, setHasError] = useState(!optimizedSrc)

  useEffect(() => {
    if (!optimizedSrc) {
      setHasError(true)
      return
    }
    if (loadedImagesCache.has(optimizedSrc)) {
      setIsLoaded(true)
      setHasError(false)
      return
    }
    setIsLoaded(false)
    setHasError(false)
  }, [optimizedSrc])

  const handleLoad = () => {
    if (optimizedSrc) {
      loadedImagesCache.add(optimizedSrc)
    }
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/40",
        aspectRatioClassName,
        containerClassName
      )}
    >
      {/* Animated Shimmer Skeleton placeholder */}
      {showSkeleton && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50"
          aria-hidden="true"
        />
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/60 text-muted-foreground p-2 text-center">
          <ImageIcon className="h-6 w-6 opacity-40 mb-1" />
          <span className="text-[11px] font-medium opacity-60 line-clamp-1">{alt || "Image unavailable"}</span>
        </div>
      ) : (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : loading || "lazy"}
          decoding={decoding || "async"}
          fetchPriority={priority ? "high" : fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300 ease-in-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
    </div>
  )
}
