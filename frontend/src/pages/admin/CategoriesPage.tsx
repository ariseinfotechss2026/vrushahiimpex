import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useCategories, type Category } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/admin/ImageUploadField"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const [editing, setEditing] = useState<Category | null | undefined>(undefined)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category deleted")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing(null)}>
          <Plus className="size-4" /> Add Category
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.length ? (
                categories.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {cat.showcaseImages && cat.showcaseImages.some((img) => img?.url) ? (
                          cat.showcaseImages.map((img, idx) =>
                            img?.url ? (
                              <img
                                key={idx}
                                src={img.url}
                                alt={img.name || `Image ${idx + 1}`}
                                title={img.name || `Photo ${idx + 1}`}
                                className="size-9 rounded-md border border-border object-cover shadow-xs"
                              />
                            ) : null
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">No images</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{cat.productCount ?? 0}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="outline" size="icon-sm" onClick={() => setEditing(cat)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="destructive" size="icon-sm">
                            <Trash2 className="size-3.5" />
                          </Button>
                        }
                        title={`Delete "${cat.name}"?`}
                        description="This cannot be undone. Categories with products cannot be deleted."
                        onConfirm={() => deleteMutation.mutate(cat._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    {isLoading ? "Loading…" : "No categories yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editing !== undefined && <CategoryFormDialog category={editing} onClose={() => setEditing(undefined)} />}
    </div>
  )
}

function CategoryFormDialog({ category, onClose }: { category: Category | null; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [showcaseFiles, setShowcaseFiles] = useState<(File | null)[]>([null, null, null, null])
  const isEdit = !!category

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit ? api.put(`/categories/${category!._id}`, formData) : api.post("/categories", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success(isEdit ? "Category updated" : "Category created")
      onClose()
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Save failed"),
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    showcaseFiles.forEach((sf, idx) => {
      if (sf) {
        formData.set(`showcase_${idx}`, sf)
      }
    })

    mutation.mutate(formData)
  }

  const existingShowcase = category?.showcaseImages ?? []

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={category?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro">Intro (optional)</Label>
            <Textarea id="intro" name="intro" defaultValue={category?.intro} rows={3} placeholder="Intro text for category page..." />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="feature1Title" className="text-xs font-semibold">Feature 1 Title</Label>
              <Input id="feature1Title" name="feature1Title" defaultValue={category?.feature1Title ?? "100% Farm Pure"} placeholder="100% Farm Pure" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feature1Subtitle" className="text-xs font-semibold">Feature 1 Subtitle</Label>
              <Input id="feature1Subtitle" name="feature1Subtitle" defaultValue={category?.feature1Subtitle ?? "Direct Sourcing & Graded"} placeholder="Direct Sourcing & Graded" className="h-8 text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="feature2Title" className="text-xs font-semibold">Feature 2 Title</Label>
              <Input id="feature2Title" name="feature2Title" defaultValue={category?.feature2Title ?? "Global Supply"} placeholder="Global Supply" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feature2Subtitle" className="text-xs font-semibold">Feature 2 Subtitle</Label>
              <Input id="feature2Subtitle" name="feature2Subtitle" defaultValue={category?.feature2Subtitle ?? "Air & Sea Freight Cargo"} placeholder="Air & Sea Freight Cargo" className="h-8 text-xs" />
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Hero Showcase Photos (4 Items)</p>
              <p className="text-xs text-muted-foreground">Upload up to 4 product photos & titles for the category hero banner grid.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((idx) => {
                const item = existingShowcase[idx]
                return (
                  <div key={idx} className="space-y-2 rounded-lg border border-border p-2.5 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground">Photo {idx + 1}</p>
                    <Input
                      name={`showcaseName_${idx}`}
                      defaultValue={item?.name ?? ""}
                      placeholder={`Title ${idx + 1} (e.g. Cardamom)`}
                      className="h-7 text-xs"
                    />
                    {item?.url && (
                      <input type="hidden" name={`existingShowcaseUrl_${idx}`} value={item.url} />
                    )}
                    {item?.public_id && (
                      <input type="hidden" name={`existingShowcasePublicId_${idx}`} value={item.public_id} />
                    )}
                    <ImageUploadField
                      label=""
                      currentUrl={item?.url}
                      onChange={(f) =>
                        setShowcaseFiles((prev) => {
                          const next = [...prev]
                          next[idx] = f
                          return next
                        })
                      }
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "Saving…" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
