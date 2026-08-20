import { useParams } from "react-router-dom"
import { BlogPostTemplate } from "@/components/BlogPostTemplate"
import { useBlogPost, useBlogPosts } from "@/lib/queries"
import { NotFoundPage } from "@/pages/NotFoundPage"

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useBlogPost(slug)
  const { data: allPosts } = useBlogPosts()

  if (isLoading) return <div className="py-24 text-center text-sm text-muted-foreground">Loading…</div>
  if (isError || !post) return <NotFoundPage />

  return <BlogPostTemplate post={post} allPosts={allPosts} />
}
