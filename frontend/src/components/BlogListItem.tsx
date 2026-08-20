import { Link } from "react-router-dom"
import type { BlogPost } from "@/lib/queries"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"
import { Calendar, ArrowRight } from "lucide-react"

export function BlogListItem({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/40">
        {/* Image Container - compact height */}
        <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-muted">
          <img
            src={cloudinaryUrl(post.image?.url, 500)}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Content Container */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div>
            {/* Meta info */}
            <div className="mb-2 flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary" />
                {formattedDate}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-sm sm:text-base font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          </div>

          {/* Action Link */}
          <div className="mt-4 border-t border-border/50 pt-3 flex items-center justify-between text-xs font-semibold text-primary">
            <span>Read Article</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
