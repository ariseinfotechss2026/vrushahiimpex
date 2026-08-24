import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react"
import { useProducts, type Product } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/admin/ImageUploadField"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"

export function ProductsPage() {
  const { data: products, isLoading } = useProducts()
  const [editing, setEditing] = useState<Product | null | undefined>(undefined)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setSelectedIds((prev) => prev.filter((item) => item !== id))
      toast.success("Highlight service deleted")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => api.post("/products/delete-bulk", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(`${selectedIds.length} highlight services deleted`)
      setSelectedIds([])
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Bulk delete failed"),
  })

  const allProductIds = products?.map((p) => p._id) ?? []
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
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-end gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <ConfirmDialog
              trigger={
                <Button variant="destructive" size="sm" className="gap-1.5 cursor-pointer">
                  <Trash2 className="size-4" />
                  Delete Selected ({selectedIds.length})
                </Button>
              }
              title={`Delete ${selectedIds.length} selected items?`}
              description="This action will permanently delete all selected items and cannot be undone."
              onConfirm={() => bulkDeleteMutation.mutate(selectedIds)}
            />
          )}

          <Button
            onClick={() => setEditing(null)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="size-4" /> Add Highlight Service
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardContent className="p-0">
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
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Homepage</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.length ? (
                products.map((p) => {
                  const isSelected = selectedIds.includes(p._id)
                  return (
                    <TableRow key={p._id} className={isSelected ? "bg-muted/40" : "hover:bg-muted/30"}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(p._id)}
                        />
                      </TableCell>
                      <TableCell>
                        {p.image?.url ? (
                          <img
                            src={cloudinaryUrl(p.image.url, 80)}
                            alt={p.name}
                            className="size-10 rounded-md object-cover border border-border"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                            <Sparkles className="size-4" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">{p.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.featured ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "text-muted-foreground"
                        }`}>
                          {p.featured ? "Yes" : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="outline" size="icon" onClick={() => setEditing(p)} className="size-8 cursor-pointer">
                            <Pencil className="size-3.5" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button variant="destructive" size="icon" className="size-8 cursor-pointer">
                                <Trash2 className="size-3.5" />
                              </Button>
                            }
                            title={`Delete "${p.name}"?`}
                            description="This action cannot be undone."
                            onConfirm={() => deleteMutation.mutate(p._id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    {isLoading ? "Loading highlight services…" : "No highlight services added yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      {editing !== undefined && (
        <ProductFormDialog product={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  )
}

function ProductFormDialog({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const isEdit = !!product

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit ? api.put(`/products/${product!._id}`, formData) : api.post("/products", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(isEdit ? "Highlight service updated" : "Highlight service created")
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Edit Highlight Service" : "Add Highlight Service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">Highlight Name</Label>
            <Input id="name" name="name" defaultValue={product?.name} placeholder="e.g. Cardamom / Cinnamon" required className="h-9 text-xs" />
          </div>

          <ImageUploadField label="Product Image" currentUrl={product?.image?.url} onChange={setFile} />

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer pt-1">
            <Checkbox name="featured" defaultChecked={product?.featured ?? true} value="true" />
            Show on Homepage
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer">
              {mutation.isPending ? "Saving…" : isEdit ? "Update Highlight" : "Save Highlight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
