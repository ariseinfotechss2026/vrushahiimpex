import { useState, useMemo } from "react"
import { PageMeta } from "@/components/PageMeta"
import { BlogListItem } from "@/components/BlogListItem"
import { useBlogPosts } from "@/lib/queries"
import { Search, Sparkles, X } from "lucide-react"

export function BlogListPage() {
  const { data: posts } = useBlogPosts()
  const blogPosts = posts ?? []
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [blogPosts, searchQuery])

  return (
    <>
      <PageMeta
        title="Blog & Insights"
        description="Import and export business articles from Vrushahi Impex — licensing guides, product export tips, and industry insights."
      />

      {/* Modern Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-3 pb-3 sm:pt-4 sm:pb-4">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-2.5 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>VRUSHAHI IMPEX INSIGHTS</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground mb-2.5 sm:mb-3">
            Blog & Trade Insights
          </h1>
          <p className="mx-auto text-sm sm:text-base text-muted-foreground max-w-none sm:whitespace-nowrap">
            Stay updated with expert licensing guides, agro-export trends, spice trade insights, and global industry updates.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-5 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-background/90 py-2.5 pl-12 pr-10 text-sm font-medium shadow-md transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/70"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 lg:px-8">
        {/* Section Header for Articles */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {!searchQuery ? "All Articles" : `Articles (${filteredPosts.length})`}
          </h2>
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              Results for &quot;{searchQuery}&quot;
            </p>
          )}
        </div>

        {/* Grid of Articles */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogListItem key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-lg font-semibold text-foreground">No articles found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search query to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </>
  )
}
