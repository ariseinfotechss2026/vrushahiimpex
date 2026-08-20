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
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"

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
}

export function ImageCarousel({
  images,
  autoplay = false,
  interval = 4000,
  itemBasisClassName = "basis-full",
  itemHeightClassName = "h-64 sm:h-96",
  rounded = false,
  showArrows = false,
  showDots = true,
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
    <Carousel setApi={setApi} opts={{ loop: true }} className="relative w-full">
      <CarouselContent>
        {images.map((img, i) => {
          const resolvedSrc = cloudinaryUrl(getImage(img.src), 800)
          if (!resolvedSrc) return null
          return (
            <CarouselItem key={i} className={`${itemBasisClassName} aspect-[16/9]`}>
              <img
                src={resolvedSrc}
                alt={img.alt}
                width="800"
                height="450"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`w-full ${itemHeightClassName} object-cover aspect-[16/9] ${rounded ? "rounded-xl sm:rounded-2xl" : ""}`}
              />
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
        <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === current
                  ? "w-7 bg-emerald-500 shadow-md ring-2 ring-white/50"
                  : "w-2.5 bg-white/70 hover:bg-white shadow-xs"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </Carousel>
  )
}
