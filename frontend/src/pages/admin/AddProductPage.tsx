import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Search, Filter, Package, FolderTree, Loader2, Heart } from "lucide-react"
import { useCategories, useCategoryProducts, type Product } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/admin/ImageUploadField"
import { AdminThumbnail } from "@/components/admin/AdminThumbnail"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"

export function AddProductPage() {
  const { data: categories } = useCategories()
  const [categoryFilter, setCategoryFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: products, isLoading } = useCategoryProducts(categoryFilter ? { category: categoryFilter } : undefined)
  const [editing, setEditing] = useState<Product | null | undefined>(undefined)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const queryClient = useQueryClient()

  const toggleHighlightMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/category-products/${id}/highlight`, {}),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["category-products"] })
      toast.success(res?.message || "Highlight updated successfully")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to toggle highlight"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/category-products/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["category-products"] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      setSelectedIds((prev) => prev.filter((item) => item !== id))
      toast.success("Product deleted successfully")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => api.post("/category-products/delete-bulk", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-products"] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success(`${selectedIds.length} products deleted`)
      setSelectedIds([])
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Bulk delete failed"),
  })

  const filteredProducts = products?.filter((p) => {
    if (!searchQuery.trim()) return true
    return p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  }) ?? []

  const allProductIds = filteredProducts.map((p) => p._id)
  const isAllSelected = allProductIds.length > 0 && allProductIds.every((id) => selectedIds.includes(id))

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(allProductIds)
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex items-center w-full sm:w-64">
            <Search className="absolute left-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search product title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3 size-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setSelectedIds([])
              }}
              className="h-9 rounded-md border border-input bg-background pl-8 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <ConfirmDialog
              trigger={
                <Button variant="destructive" size="sm" className="gap-1.5 text-xs font-semibold cursor-pointer">
                  <Trash2 className="size-4" />
                  Delete Selected ({selectedIds.length})
                </Button>
              }
              title={`Delete ${selectedIds.length} selected products?`}
              description="This action will permanently delete all selected products from their respective categories."
              onConfirm={() => bulkDeleteMutation.mutate(selectedIds)}
            />
          )}

          <Button
            onClick={() => setEditing(null)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="size-4" /> Add New Product
          </Button>
        </div>
      </div>

      {/* Main Products Table Card */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Product Title / Name</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold text-center w-20">Highlight</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length ? (
                  filteredProducts.map((p) => {
                    const isSelected = selectedIds.includes(p._id)
                    const categoryName = p.category && typeof p.category === "object" ? p.category.name : "Uncategorized"

                    return (
                      <TableRow key={p._id} className={isSelected ? "bg-muted/40" : "hover:bg-muted/30"}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelect(p._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <AdminThumbnail
                            src={p.image?.url}
                            alt={p.name}
                            className="size-11 rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">{p.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            <FolderTree className="size-3" />
                            {categoryName}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                          {p.description || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            type="button"
                            disabled={toggleHighlightMutation.isPending}
                            onClick={() => toggleHighlightMutation.mutate(p._id)}
                            title={p.isHighlight ? "Remove from Highlight Products" : "Mark as Highlight Product (Max 3)"}
                            className="p-1.5 rounded-full hover:bg-muted/80 transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            <Heart
                              className={`size-4.5 transition-all duration-300 ${
                                p.isHighlight
                                  ? "fill-red-500 text-red-500 scale-110 drop-shadow-xs"
                                  : "text-muted-foreground/60 hover:text-red-500 hover:scale-105"
                              }`}
                            />
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditing(p)}
                              className="size-8 cursor-pointer hover:border-emerald-500/50 hover:text-emerald-600"
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <ConfirmDialog
                              trigger={
                                <Button variant="destructive" size="icon" className="size-8 cursor-pointer">
                                  <Trash2 className="size-3.5" />
                                </Button>
                              }
                              title={`Delete "${p.name}"?`}
                              description="This product will be permanently removed from the category catalog."
                              onConfirm={() => deleteMutation.mutate(p._id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-36 text-center text-muted-foreground">
                      {isLoading ? (
                        <span className="animate-pulse">Loading category products…</span>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <Package className="size-8 text-muted-foreground/60" />
                          <p className="text-xs font-semibold">No products found in this category</p>
                          <p className="text-[11px] text-muted-foreground">Click "Add New Product" to create your first category item.</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Form Dialog */}
      {editing !== undefined && (
        <ProductFormDialog
          product={editing}
          categories={categories ?? []}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  )
}

function ProductFormDialog({
  product,
  categories,
  onClose,
}: {
  product: Product | null
  categories: { _id: string; name: string }[]
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const isEdit = !!product
  const currentCategoryId = typeof product?.category === "object" ? product?.category?._id : product?.category

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit ? api.put(`/category-products/${product!._id}`, formData) : api.post("/category-products", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-products"] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success(isEdit ? "Product updated successfully" : "Product added to category successfully")
      onClose()
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Save failed"),
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (file) formData.set("image", file)
    mutation.mutate(formData)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Edit Category Product" : "Add New Category Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs font-semibold">Select Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={typeof currentCategoryId === "string" ? currentCategoryId : ""}
              required
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="" disabled>
                Select target category…
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Title / Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">Product Title / Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name}
              placeholder="e.g. Cardamom / Clove / Almond"
              required
              className="h-10 text-xs"
            />
          </div>

          {/* Product Image */}
          <ImageUploadField
            label="Product Image"
            currentUrl={product?.image?.url}
            onChange={setFile}
          />

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">Product Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              placeholder="Enter product description, specifications, or details…"
              rows={3}
              className="text-xs resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer pt-1">
            <Checkbox name="isHighlight" defaultChecked={product?.isHighlight ?? false} value="true" />
            <span className="flex items-center gap-1 text-foreground">
              <Heart className="size-3.5 fill-red-500 text-red-500" /> Highlight on Homepage (Max 3 Products)
            </span>
          </label>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer gap-1.5"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving Product…
                </>
              ) : (
                isEdit ? "Update Product" : "Save & Add Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

