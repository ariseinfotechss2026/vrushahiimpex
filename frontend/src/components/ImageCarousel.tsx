import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
import { getImage } from "@/assets/images"
import { cn } from "@/lib/utils"
import { OptimizedImage } from "@/components/ui/OptimizedImage"

interface CarouselImage {
  src: string
  alt: string
}

interface ImageCarouselProps {
  images: CarouselImage[]
  autoplay?: boolean
  interval?: number
  /** basis classes per breakpoint for how many slides show at once */
  itemBasisClassName?: string
  itemHeightClassName?: string
  rounded?: boolean
  showArrows?: boolean
  showDots?: boolean
  className?: string
  imageClassName?: string
}

export function ImageCarousel({
  images,
  autoplay = false,
  interval = 4000,
  itemBasisClassName = "basis-full",
  itemHeightClassName,
  rounded = false,
  showArrows = false,
  showDots = true,
  className,
  imageClassName,
}: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    const updateSnap = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }

    updateSnap()
    api.on("select", updateSnap)
    api.on("reInit", updateSnap)

    return () => {
      api.off("select", updateSnap)
      api.off("reInit", updateSnap)
    }
  }, [api, images])

  useEffect(() => {
    if (!api || !autoplay || images.length <= 1) return
    const id = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext()
      else api.scrollTo(0)
    }, interval)
    return () => clearInterval(id)
  }, [api, autoplay, interval, images.length])

  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className={cn("relative w-full h-full", className)}>
      <CarouselContent className="ml-0 h-full">
        {images.map((img, i) => {
          const resolvedSrc = getImage(img.src)
          if (!resolvedSrc) return null
          return (
            <CarouselItem key={i} className={cn("min-w-0 shrink-0 grow-0 basis-full pl-0 h-full", itemBasisClassName)}>
              <div className="relative w-full h-full overflow-hidden">
                <OptimizedImage
                  src={resolvedSrc}
                  alt={img.alt}
                  targetWidth={800}
                  srcSetWidths={[400, 600, 800, 1200]}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={i === 0}
                  className={cn(
                    "w-full h-full object-cover select-none transition-transform duration-500",
                    itemHeightClassName,
                    rounded && "rounded-xl sm:rounded-2xl",
                    imageClassName
                  )}
                  containerClassName="w-full h-full"
                />
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>

      {showArrows && images.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}

      {showDots && images.length > 1 && count > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-lg pointer-events-auto">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                api?.scrollTo(index)
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                index === current
                  ? "w-6 bg-emerald-400 shadow-xs ring-1 ring-emerald-300/50"
                  : "w-2 bg-white/60 hover:bg-white"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </Carousel>
  )
}
