import { useParams } from "react-router-dom"
import { ProductCategoryTemplate } from "@/components/ProductCategoryTemplate"
import { useCategory } from "@/lib/queries"
import { NotFoundPage } from "@/pages/NotFoundPage"

export function ProductCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: category, isLoading, isError } = useCategory(slug)

  if (isLoading) return <div className="py-24 text-center text-sm text-muted-foreground">Loading…</div>
  if (isError || !category) return <NotFoundPage />

  return <ProductCategoryTemplate category={category} />
}
