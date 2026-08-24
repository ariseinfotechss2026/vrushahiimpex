import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useBlogPosts, type BlogPost } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/admin/ImageUploadField"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"

export function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts()
  const [editing, setEditing] = useState<BlogPost | null | undefined>(undefined)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] })
      toast.success("Post deleted")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 cursor-pointer">
          <Plus className="size-4" /> Add Post
        </Button>
      </div>

      <Card className="border-border/80 bg-card shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold">Image</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Author</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.length ? (
                posts.map((post) => (
                  <TableRow key={post._id} className="hover:bg-muted/30">
                    <TableCell>
                      {post.image?.url && (
                        <img
                          src={cloudinaryUrl(post.image.url, 80)}
                          alt=""
                          className="size-10 rounded-md object-cover border border-border"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{post.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{post.author}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="outline" size="icon" onClick={() => setEditing(post)} className="size-8 cursor-pointer">
                          <Pencil className="size-3.5" />
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button variant="destructive" size="icon" className="size-8 cursor-pointer">
                              <Trash2 className="size-3.5" />
                            </Button>
                          }
                          title={`Delete "${post.title}"?`}
                          description="This action cannot be undone."
                          onConfirm={() => deleteMutation.mutate(post._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    {isLoading ? "Loading posts…" : "No blog posts yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editing !== undefined && <BlogFormDialog post={editing} onClose={() => setEditing(undefined)} />}
    </div>
  )
}

function BlogFormDialog({ post, onClose }: { post: BlogPost | null; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const isEdit = !!post

  const mutation = useMutation({
    mutationFn: (formData: FormData) => (isEdit ? api.put(`/blog/${post!._id}`, formData) : api.post("/blog", formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] })
      toast.success(isEdit ? "Post updated" : "Post created")
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
          <DialogTitle className="text-lg font-bold">{isEdit ? "Edit Post" : "Add Post"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-4 overflow-y-auto pr-1 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">Title</Label>
            <Input id="title" name="title" defaultValue={post?.title} required className="h-9 text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="author" className="text-xs font-semibold">Author</Label>
              <Input id="author" name="author" defaultValue={post?.author} required className="h-9 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-semibold">Publish Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={post?.date ? post.date.slice(0, 10) : new Date().toISOString().slice(0, 10)}
                required
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt" className="text-xs font-semibold">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} rows={2} required className="text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs font-semibold">Content</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={post?.content}
              rows={7}
              placeholder="Separate paragraphs with a blank line"
              required
              className="text-xs"
            />
          </div>

          <ImageUploadField label="Cover Image" currentUrl={post?.image?.url} onChange={setFile} />

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer">
              {mutation.isPending ? "Saving…" : isEdit ? "Update Post" : "Save Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
