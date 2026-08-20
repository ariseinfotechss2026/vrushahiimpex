import { Link } from "react-router-dom"
import { Award, Package } from "lucide-react"

import { ShowcaseHero } from "@/components/hero/ShowcaseHero"
import { ImageCarousel } from "@/components/ImageCarousel"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { useHeroItems, useProducts, useSiteSettings, useAboutCompany, useCategoryProducts, type HeroItem } from "@/lib/queries"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"

const FALLBACK_HERO_ITEMS: HeroItem[] = [
  {
    _id: "fallback-hero-1",
    slug: "spices",
    name: "Fresh Spices",
    eyebrow: "Premium Indian Export",
    titleLine1: "Authentic Indian",
    titleLine2: "Spices & Agro Export",
    blurb: "Sourcing and exporting premium grade Indian spices, grains, and agricultural produce globally.",
    tint: "rgba(180, 83, 9, 0.15)",
    badge: "Export Quality",
    rating: "4.9",
    reviewsCount: "120",
    prepTime: "Fast Global Delivery",
    calories: "100% Pure",
    spiceLevel: "Mild to Hot",
    description: "Handpicked Indian spices certified for global export standards.",
    ingredients: ["Turmeric", "Cumin", "Chilli"],
    price: "0",
    order: 0,
    items: [
      {
        name: "Fresh Spices",
        description: "Handpicked Indian spices certified for global export standards.",
        image: { url: "https://res.cloudinary.com/demo761/image/upload/f_auto,q_auto,w_450/v1786651142/vrushahi/hero/n1sytsmjtixgo9yzn5qi.png", public_id: "fallback" }
      }
    ]
  }
]

export function HomePage() {
  const { data: heroItems } = useHeroItems()
  const { data: settings } = useSiteSettings()
  const { data: featuredProducts } = useProducts({ featured: true })
  const { data: aboutData } = useAboutCompany()
  const { data: highlightProducts } = useCategoryProducts({ highlight: true })

  return (
    <>
      <ShowcaseHero
        dishes={heroItems && heroItems.length > 0 ? heroItems : FALLBACK_HERO_ITEMS}
        companyName={settings?.companyInfo?.name || "Vrushahi Impex"}
      />

      {/* Our Highlights Section - Continuous Auto-Slider */}
      <section className="w-full bg-background pt-3 sm:pt-4 pb-8 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-2 sm:mb-3">
          <SectionHeading
            title="Our Services"
            highlightWord="Highlights"
            description="Handpicked export-quality agro products, spices, and nuts sourced directly from top Indian origins."
            align="center"
          />
        </div>
        <div className="relative w-full overflow-hidden -mt-2 sm:-mt-5">
          {/* Subtle fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />

          <div className="animate-marquee flex items-center gap-10 sm:gap-16">
            {[...(featuredProducts ?? []), ...(featuredProducts ?? [])].map((product, idx) => (
              <div
                key={`${product._id}-${idx}`}
                className="group flex shrink-0 flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="flex h-44 w-44 items-center justify-center p-1 sm:h-56 sm:w-56 md:h-64 md:w-64 aspect-square">
                  <img
                    src={cloudinaryUrl(product.image?.url, 250)}
                    alt={product.name}
                    width="250"
                    height="250"
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain aspect-square filter drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="-mt-3 sm:-mt-5 md:-mt-6 text-base sm:text-xl font-semibold capitalize text-foreground/90 transition-colors group-hover:text-emerald-600 tracking-wide">
                  {product.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Company Section - Reserved Height Container to prevent CLS layout shift */}
      <section className="bg-secondary/40 pt-12 pb-8 sm:pt-16 sm:pb-10 min-h-[420px]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2 min-h-[380px]">
          {aboutData ? (
            <>
              {aboutData.images && aboutData.images.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl shadow-lg group aspect-[16/9] min-h-[280px]">
                  <ImageCarousel
                    images={aboutData.images.map((img) => ({
                      src: cloudinaryUrl(img.url, 800) || "",
                      alt: img.alt || "Vrushahi Impex About Company",
                    }))}
                    autoplay
                    interval={5000}
                    itemBasisClassName="basis-full"
                    itemHeightClassName="h-72 sm:h-96 md:h-[400px]"
                    rounded
                  />
                </div>
              )}
              <div>
                <SectionHeading
                  badge={aboutData.badge}
                  icon={Award}
                  title={aboutData.title}
                  highlightWord={aboutData.highlightWord}
                  align="left"
                  className="mb-4"
                />
                {aboutData.leadText && (
                  <p className="mt-4 text-base font-medium text-foreground leading-relaxed">
                    {aboutData.leadText}
                  </p>
                )}
                {aboutData.bodyText && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {aboutData.bodyText}
                  </p>
                )}
                <Button
                  render={
                    <Link
                      to={aboutData.buttonLink || "/about-us"}
                      aria-label={`Read more about ${settings?.companyInfo?.name || "Vrushahi Impex"}`}
                    />
                  }
                  className="mt-6 font-semibold px-6 shadow-md hover:shadow-lg transition-all"
                >
                  {aboutData.buttonText && aboutData.buttonText.toLowerCase() !== "read more"
                    ? aboutData.buttonText
                    : "Read More About Vrushahi Impex"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="h-72 sm:h-96 w-full rounded-2xl bg-slate-200/60 animate-pulse aspect-[16/9]" />
              <div className="space-y-4">
                <div className="h-8 w-48 rounded bg-slate-200/60 animate-pulse" />
                <div className="h-10 w-3/4 rounded bg-slate-200/60 animate-pulse" />
                <div className="h-20 w-full rounded bg-slate-200/60 animate-pulse" />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Our Highlight Products Section */}
      <section className="mx-auto max-w-7xl px-4 pt-2 pb-10 sm:pt-4 sm:pb-12 sm:px-6 min-h-[380px]">
        <SectionHeading
          icon={Package}
          title="Our Highlight Products"
          highlightWord="Highlight Products"
          description="Explore our range of premium products harvested and processed under strict quality standards."
          align="center"
          className="mb-4 sm:mb-6"
        />
        {highlightProducts && highlightProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 min-h-[320px]">
            {highlightProducts.slice(0, 3).map((p) => (
              <Link key={p._id} to={p.category && typeof p.category === "object" ? `/products/${p.category.slug}` : "/"}>
                <ProductCard name={p.name} image={p.image?.url ?? ""} description={p.description} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 min-h-[320px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 w-full rounded-2xl bg-slate-200/60 animate-pulse aspect-[4/3]" />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
