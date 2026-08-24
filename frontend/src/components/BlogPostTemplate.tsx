import { Link } from "react-router-dom"
import { PageMeta } from "@/components/PageMeta"
import type { BlogPost } from "@/lib/queries"
import { BlogListItem } from "@/components/BlogListItem"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { ArrowLeft, Calendar } from "lucide-react"

export function BlogPostTemplate({ post, allPosts = [] }: { post: BlogPost; allPosts?: BlogPost[] }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // Get related posts (excluding current post)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  const paragraphs = post.content.split("\n\n")

  return (
    <>
      <PageMeta title={`${post.title} | Vrushahi Impex Blog`} description={post.excerpt} />

      {/* Hero Header Section */}
      <div className="bg-muted/30 border-b border-border/60 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Back button */}
          <Link
            to="/blog"
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>

          {/* Meta Badges */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary" /> {formattedDate}
            </span>
          </div>

          {/* Post Title */}
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl sm:leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Main Content Container */}
      <article className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Featured Image - Compact & Centered with High Priority */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-border/70 shadow-sm max-w-xl mx-auto">
          <OptimizedImage
            src={post.image?.url}
            alt={post.title}
            targetWidth={900}
            srcSetWidths={[400, 650, 900, 1200]}
            sizes="(max-width: 768px) 100vw, 750px)"
            priority
            className="h-48 sm:h-56 w-full object-cover"
            containerClassName="h-48 sm:h-56 w-full"
          />
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-foreground/90 font-normal leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base sm:text-lg leading-relaxed text-foreground/85">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-6 border-t border-border/60 pt-3.5 sm:pt-4">
            <h3 className="mb-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Recommended Reads
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <BlogListItem key={related.slug} post={related} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
