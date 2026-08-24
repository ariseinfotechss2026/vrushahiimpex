import { useState, useEffect } from "react"
import { PageMeta } from "@/components/PageMeta"
import { ProductCard } from "@/components/ProductCard"
import type { Category, Product } from "@/lib/queries"
import { getImage } from "@/assets/images"
import { OptimizedImage } from "@/components/ui/OptimizedImage"

function resolveProductImage(url?: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }
  return getImage(url)
}

export function ProductCategoryTemplate({ category }: { category: Category & { products: Product[] } }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 60)
    return () => clearTimeout(timer)
  }, [category.slug])

  const showcaseProducts =
    category.showcaseImages && category.showcaseImages.length > 0
      ? category.showcaseImages.map((s) => ({
          name: s.name || "",
          imageSrc: resolveProductImage(s.url),
        }))
      : category.products.slice(0, 4).map((p) => ({
          name: p.name,
          imageSrc: resolveProductImage(p.image?.url),
        }))

  // Starting positions towards grid center for 2x2 burst out animation
  const initialOffsets = [
    "translate-x-[45%] translate-y-[45%] scale-0 opacity-0",   // Top-Left
    "-translate-x-[45%] translate-y-[45%] scale-0 opacity-0",  // Top-Right
    "translate-x-[45%] -translate-y-[45%] scale-0 opacity-0",  // Bottom-Left
    "-translate-x-[45%] -translate-y-[45%] scale-0 opacity-0", // Bottom-Right
  ]

  return (
    <>
      <PageMeta
        title={`${category.name} Exporters in India`}
        description={category.intro || `Vrushahi Impex exports high quality ${category.name.toLowerCase()} from India. Enquire now for bulk orders and export enquiries.`}
      />

      {/* TOP HERO SECTION MATCHING EXACT LAYOUT */}
      <section className="bg-slate-50/60 pt-5 pb-3 md:pb-4 border-b border-slate-100 overflow-hidden font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Main Hero Banner Row */}
          <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-12">
            
            {/* Left Section: Category Title, Intro Paragraph & Export Stats */}
            <div className="flex-1 lg:max-w-xl flex flex-col justify-start">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif leading-tight mb-3">
                {category.name}
              </h1>

              {category.intro && (
                <p className="text-xs sm:text-base leading-relaxed text-slate-700 font-normal mb-4 sm:mb-6">
                  {category.intro}
                </p>
              )}

              {(category.feature1Title || category.feature2Title) && (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 border-t border-slate-200/80 pt-4 sm:pt-5">
                  {category.feature1Title && (
                    <div>
                      <h4 className="text-lg sm:text-2xl font-bold text-slate-900 font-serif">
                        {category.feature1Title}
                      </h4>
                      {category.feature1Subtitle && (
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                          {category.feature1Subtitle}
                        </p>
                      )}
                    </div>
                  )}
                  {category.feature2Title && (
                    <div>
                      <h4 className="text-lg sm:text-2xl font-bold text-slate-900 font-serif">
                        {category.feature2Title}
                      </h4>
                      {category.feature2Subtitle && (
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                          {category.feature2Subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Section: 2x2 Grid of Clean PNG Images (Center Burst Animation) */}
            <div className="w-full lg:w-[50%] grid grid-cols-2 gap-3 sm:gap-6 items-start mt-2 lg:-mt-6">
              {showcaseProducts.map((prod, idx) => (
                <div
                  key={prod.name}
                  style={{
                    transitionDelay: `${idx * 100}ms`,
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  className={`flex flex-col items-center justify-start relative group p-1 transition-all duration-1000 transform ${
                    isLoaded
                      ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                      : initialOffsets[idx] || "scale-0 opacity-0"
                  }`}
                >
                  {prod.imageSrc && (
                    <OptimizedImage
                      src={prod.imageSrc}
                      alt={prod.name}
                      targetWidth={300}
                      priority={idx < 2}
                      className="w-full h-[105px] sm:h-[160px] object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                      containerClassName="w-full h-[105px] sm:h-[160px] bg-transparent flex items-center justify-center"
                    />
                  )}
                  <div className="mt-1 text-center">
                    <h4 className="text-xs sm:text-base font-bold text-slate-800 tracking-wide">{prod.name}</h4>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* MAIN PRODUCTS CATALOG GRID */}
      <div className="mx-auto max-w-7xl px-4 pt-1 pb-10 sm:pt-2 sm:px-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              All {category.name} Range
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore our full collection of export-grade {category.name.toLowerCase()}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 shrink-0">
            {category.products.length} Products
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {category.products.map((product, idx) => (
            <ProductCard
              key={product._id}
              name={product.name}
              image={product.image?.url ?? ""}
              description={product.description}
              priority={idx < 4}
            />
          ))}
        </div>
      </div>
    </>
  )
}



