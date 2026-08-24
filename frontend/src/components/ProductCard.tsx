import { getImage } from "@/assets/images"
import { OptimizedImage } from "@/components/ui/OptimizedImage"

interface ProductCardProps {
  name: string
  image: string
  description?: string
  priority?: boolean
}

export function ProductCard({ name, image, description, priority = false }: ProductCardProps) {
  const isPng = image.endsWith(".png")
  const resolvedImage = getImage(image)

  return (
    <div className="group bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Container with Zoom & Shimmer Placeholder */}
      <div className="relative h-52 sm:h-56 w-full aspect-[4/3] overflow-hidden bg-slate-50/60 p-3 flex items-center justify-center">
        <OptimizedImage
          src={resolvedImage}
          alt={name}
          targetWidth={350}
          srcSetWidths={[240, 350, 500]}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className={`w-full h-full ${isPng ? "object-contain" : "object-cover"} group-hover:scale-105 transition-transform duration-500`}
          containerClassName="w-full h-full bg-transparent flex items-center justify-center"
        />
      </div>

      {/* Content Section */}
      <div className="p-5 pt-2 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug mb-2">
            {name}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-5">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

