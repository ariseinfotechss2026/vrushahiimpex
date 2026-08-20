import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import Lenis from "lenis"
import {
  Play,
  X,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useHeroVideos, type HeroItem } from "@/lib/queries"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"
import { cn } from "@/lib/utils"

gsap.registerPlugin(MotionPathPlugin)

// C-shaped SVG path matching top-center -> right-edge -> bottom-center arc
const SVG_CURVE_PATH = "M 880 -30 C 1350 200, 1350 700, 680 930"
const REST_POINT = 0.38 // Shifted rest position higher up along the curve

export function ShowcaseHero({ dishes: DISHES, companyName }: { dishes: HeroItem[]; companyName: string }) {
  const { data: bgVideos } = useHeroVideos()
  const activeBgVideo = bgVideos?.find((v) => v.isActive)
  const activeVideoUrl = activeBgVideo?.videoUrl || ""

  const [activeIndex, setActiveIndex] = useState(0)
  const [activeSubIndex, setActiveSubIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [loadVideo, setLoadVideo] = useState(false)

  useEffect(() => {
    // Defer heavy video stream loading by 1.2s post-mount so FCP & LCP paint in <400ms using instant WebP image
    const timer = setTimeout(() => setLoadVideo(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  const pathRef = useRef<SVGPathElement>(null)
  const platterRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const idleTweenRef = useRef<gsap.core.Tween | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  const activeDish = DISHES[activeIndex] || DISHES[0]
  const currentSubItem = activeDish.items?.[activeSubIndex] || {
    name: activeDish.name,
    image: activeDish.image,
    description: activeDish.blurb,
  }
  const currentImageUrl = cloudinaryUrl(currentSubItem.image?.url, 450)

  // Preload main hero platter image aggressively for millisecond rendering
  useEffect(() => {
    if (currentImageUrl) {
      const img = new Image()
      img.src = currentImageUrl
    }
  }, [currentImageUrl])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  // Helper: Entrance Motion (Snappy 0.75s duration for instant responsiveness)
  function playEntrance(el: HTMLElement, path: SVGPathElement, duration = 0.75) {
    gsap.set(el, {
      scale: 0.65,
      rotation: -15,
      opacity: 0,
      filter: "blur(6px)",
      boxShadow: "0 10px 20px -5px rgba(0,0,0,0.3)",
    })

    const tl = gsap.timeline()
    tl.to(
      el,
      {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          start: 0.02,
          end: REST_POINT,
        },
        duration,
        ease: "power3.out",
      },
      0
    )
      .to(
        el,
        {
          opacity: 1,
          filter: "blur(0px)",
          boxShadow: "0 45px 85px -15px rgba(0,0,0,0.65)",
          duration: duration * 0.4,
          ease: "power2.out",
        },
        0
      )
      .to(
        el,
        {
          scale: 1.05,
          rotation: 1,
          duration: duration * 0.4,
          ease: "power2.out",
        },
        duration * 0.3
      )
      .to(
        el,
        {
          scale: 1,
          rotation: 0,
          duration: 0.35,
          ease: "back.out(1.2)",
        },
        ">-0.05"
      )

    return tl
  }

  // Helper: Exit Motion along curve
  function playExit(el: HTMLElement, path: SVGPathElement) {
    return gsap.to(el, {
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.5],
        start: REST_POINT,
        end: 0.98,
      },
      scale: 0.45,
      rotation: "+=90",
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.5,
      ease: "power2.in",
    })
  }

  // Helper: Idle floating animation
  function startIdle(el: HTMLElement) {
    return gsap.to(el, {
      y: "+=6",
      rotation: "+=1",
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    })
  }

  // Desktop entrance animation on mount
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches
    if (!isDesktop || !platterRef.current || !pathRef.current) return

    const tl = playEntrance(platterRef.current, pathRef.current)
    tl.then(() => {
      if (platterRef.current) {
        idleTweenRef.current = startIdle(platterRef.current)
      }
    })

    return () => {
      tl.kill()
      idleTweenRef.current?.kill()
    }
  }, [])

  // Automatic sub-item curve scrolling loop for active category
  useEffect(() => {
    if (!activeDish.items || activeDish.items.length <= 1 || videoModalOpen) return

    const interval = setInterval(() => {
      const el = platterRef.current
      const path = pathRef.current
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches

      if (isDesktop && el && path && !isAnimating) {
        setIsAnimating(true)
        idleTweenRef.current?.kill()

        playExit(el, path).then(() => {
          setActiveSubIndex((prev) => (prev + 1) % activeDish.items.length)
          playEntrance(el, path, 1.4).then(() => {
            if (platterRef.current) {
              idleTweenRef.current = startIdle(platterRef.current)
            }
            setIsAnimating(false)
          })
        })
      } else if (!isDesktop) {
        setActiveSubIndex((prev) => (prev + 1) % activeDish.items.length)
      }
    }, 3800)

    return () => clearInterval(interval)
  }, [activeIndex, activeDish.items, videoModalOpen, isAnimating])

  // Dish Switching Handler
  async function handleDishSwitch(newIndex: number) {
    if (newIndex === activeIndex || isAnimating) return
    const el = platterRef.current
    const path = pathRef.current
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches

    if (!isDesktop || !el || !path) {
      setActiveIndex(newIndex)
      setActiveSubIndex(0)
      return
    }

    setIsAnimating(true)
    // Pause Lenis smooth scrolling during transition as specified
    lenisRef.current?.stop()
    idleTweenRef.current?.kill()

    // 1. Current platter exits along SVG curve path
    await playExit(el, path)

    // 2. Change active dish state & reset sub-index
    setActiveIndex(newIndex)
    setActiveSubIndex(0)

    // 3. Next platter enters along the SVG curve path
    await playEntrance(el, path, 1.4)

    // 4. Start idle loop & resume Lenis scrolling
    idleTweenRef.current = startIdle(el)
    lenisRef.current?.start()
    setIsAnimating(false)
  }

  // Handle Close Video Modal
  async function handleCloseVideo() {
    setVideoModalOpen(false)
    const el = platterRef.current
    const path = pathRef.current
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches

    if (isDesktop && el && path) {
      await playEntrance(el, path, 1.4)
      idleTweenRef.current = startIdle(el)
      lenisRef.current?.start()
    }
  }

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden bg-neutral-950 text-white font-sans">
      {/* 1. Viewport Background Video (Deferred load for 100/100 LCP score) */}
      {activeVideoUrl && loadVideo && (
        <div className="absolute inset-0 z-0 animate-in fade-in duration-1000">
          <video
            key={activeVideoUrl}
            src={activeVideoUrl}
            poster={currentImageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover object-center brightness-90 contrast-105"
          />
        </div>
      )}

      {/* 2. Dish-Specific Color Tint Overlay: Multiply blend mode, low opacity, ~1.4s crossfade */}
      <div
        className="absolute inset-0 z-0 transition-colors duration-[1400ms] ease-out pointer-events-none"
        style={{
          backgroundColor: activeDish.tint,
          mixBlendMode: "multiply",
          opacity: 0.5,
        }}
      />

      {/* Subtle vignette gradients for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent pointer-events-none" />

      {/* 3. SVG Gradient Ribbon/Curve: Upper-Right to Lower-Left near fridge */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
        style={{ mixBlendMode: "multiply" }}
      >
        <defs>
          <linearGradient id="platter-ribbon-grad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb37a" />
            <stop offset="50%" stopColor="#ff9654" />
            <stop offset="100%" stopColor="#ff7a3d" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={SVG_CURVE_PATH}
          fill="none"
          stroke="url(#platter-ribbon-grad)"
          strokeWidth="140"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {/* Main Hero Container */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col justify-between px-4 py-6 sm:px-8 sm:py-8 lg:py-12">
        {/* Upper Grid Layout: Center-Left Content & Center Platter & Top-Right Overview Card */}
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Center-Left Content Area (6 Columns) */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-4 sm:space-y-6 pt-2 sm:pt-4">

            {/* Large Two-Tone Display Title */}
            <h1 className="text-3xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
              <span className="block text-white/95 drop-shadow-md">{activeDish.titleLine1}</span>
              <span className="block bg-gradient-to-r from-amber-200 via-orange-200 to-amber-100 bg-clip-text text-transparent drop-shadow-sm">
                {activeDish.titleLine2}
              </span>
            </h1>

            {/* Description Blurb with Active Item Badge */}
            <div className="space-y-2.5">
              {currentSubItem.name && (
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-300/40 backdrop-blur-md">
                  <span>✦ {currentSubItem.name}</span>
                </div>
              )}
              <p className="max-w-lg text-xs sm:text-base text-white/90 leading-relaxed font-normal drop-shadow">
                {currentSubItem.description || activeDish.blurb}
              </p>
            </div>
          </div>

          {/* Desktop GSAP Platter (~380px): Placed along SVG Curve */}
          <div
            ref={platterRef}
            className="absolute top-0 left-0 z-20 hidden size-[380px] overflow-hidden rounded-full lg:block"
          >
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt={currentSubItem.name}
                fetchPriority="high"
                decoding="sync"
                width="380"
                height="380"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : null}
          </div>

          {/* Mobile / Tablet Platter View (Static centered fallback - responsive sizing for 320px+ viewports) */}
          <div className="relative z-10 flex justify-center lg:hidden my-3 sm:my-6">
            <div className="relative size-56 sm:size-72 md:size-80 max-w-[80vw] overflow-hidden rounded-full aspect-square shadow-2xl ring-4 ring-amber-400/20">
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={currentSubItem.name}
                  fetchPriority="high"
                  decoding="sync"
                  width="320"
                  height="320"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Area: Horizontal Thumbnail Carousel */}
        <div className="relative z-20 mt-6 flex flex-col sm:flex-row items-center justify-start gap-4 pt-4 w-full">
          {/* Thumbnail Carousel */}
          <div className="flex w-full max-w-full items-center gap-3.5 overflow-x-auto py-3 px-2 pr-8 no-scrollbar">
            {DISHES.map((dish, i) => {
              const thumbUrl = dish.image?.url ? cloudinaryUrl(dish.image.url, 100) : null
              return (
                <button
                  key={dish._id}
                  type="button"
                  onClick={() => handleDishSwitch(i)}
                  disabled={isAnimating}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-full p-2 pr-4 transition-all duration-300 shrink-0",
                    i === activeIndex
                      ? "bg-white/25 ring-2 ring-amber-300 shadow-xl scale-105"
                      : "bg-white/10 ring-1 ring-white/20 opacity-75 hover:opacity-100 hover:bg-white/15"
                  )}
                  aria-label={dish.name}
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={dish.name}
                      loading="lazy"
                      decoding="async"
                      className="size-10 object-contain shrink-0"
                    />
                  ) : null}
                  <span className="text-xs font-semibold text-white whitespace-nowrap">{dish.titleLine2}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>



      {/* Video Modal Player */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-neutral-900 border border-white/20 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-neutral-950">
                  <Play className="size-4 fill-current ml-0.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeDish.name} &bull; Preparation Video</h3>
                  <p className="text-xs text-white/60">Crafted by {companyName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted
                      setIsMuted(!isMuted)
                    }
                  }}
                  className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {isMuted ? <VolumeX className="size-5 text-red-400" /> : <Volume2 className="size-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleCloseVideo}
                  className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>

            {/* Video Canvas */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={videoRef}
                src={activeDish.videoUrl}
                controls
                autoPlay
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  )
}
