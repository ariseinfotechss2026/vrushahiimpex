import { useState, useRef, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, X, Video, CheckCircle2, Film, Loader2, Building2 } from "lucide-react"
import { useHeroItems, useHeroVideos, useAboutCompany, type HeroItem, type HeroSubItem, type AboutCompany, type AboutCompanyImage } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { getImage } from "@/assets/images"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/admin/ImageUploadField"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"

export function HeroPage() {
  const { data: items, isLoading: isItemsLoading } = useHeroItems()
  const { data: videos, isLoading: isVideosLoading } = useHeroVideos()
  const { data: aboutData, isLoading: isAboutLoading } = useAboutCompany()
  const [editing, setEditing] = useState<HeroItem | null | undefined>(undefined)
  const [addVideoOpen, setAddVideoOpen] = useState(false)
  const [editAboutOpen, setEditAboutOpen] = useState(false)
  const queryClient = useQueryClient()

  const reorderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) => api.put(`/hero/${id}`, { order }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["heroItems"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/hero/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroItems"] })
      toast.success("Hero item deleted")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  })

  const setActiveVideoMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/hero/videos/${id}/active`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroVideos"] })
      toast.success("Active background video updated")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to set active video"),
  })

  const deleteVideoMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/hero/videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroVideos"] })
      toast.success("Background video deleted")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  })

  function move(index: number, dir: -1 | 1) {
    if (!items) return
    const other = items[index + dir]
    const current = items[index]
    if (!other) return
    reorderMutation.mutate({ id: current._id, order: other.order })
    reorderMutation.mutate({ id: other._id, order: current.order })
  }

  return (
    <div className="space-y-8">
      {/* SECTION 1: DYNAMIC HERO BACKGROUND VIDEOS */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Film className="size-5 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-lg font-bold">Hero Background Videos</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Manage dynamic background MP4 videos for the homepage hero. <strong>Only 1 video can be active at a time.</strong>
            </CardDescription>
          </div>
          <Button
            onClick={() => setAddVideoOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 cursor-pointer"
          >
            <Video className="size-4" /> Add Background Video
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold">Video Preview</TableHead>
                <TableHead className="font-semibold">Video Title</TableHead>
                <TableHead className="font-semibold">Active Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos?.length ? (
                videos.map((v) => (
                  <TableRow key={v._id} className={v.isActive ? "bg-emerald-500/5" : "hover:bg-muted/30"}>
                    <TableCell>
                      <div className="relative size-16 overflow-hidden rounded-lg border border-border bg-black">
                        <video
                          src={v.videoUrl}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{v.title}</TableCell>
                    <TableCell>
                      {v.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20 shadow-xs">
                          <CheckCircle2 className="size-3.5 text-emerald-500" /> Active Homepage Video
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={setActiveVideoMutation.isPending}
                          onClick={() => setActiveVideoMutation.mutate(v._id)}
                          className="text-xs font-semibold hover:border-emerald-500/50 hover:text-emerald-600 cursor-pointer"
                        >
                          Set Active
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <ConfirmDialog
                        trigger={
                          <Button variant="destructive" size="icon" className="size-8 cursor-pointer">
                            <Trash2 className="size-3.5" />
                          </Button>
                        }
                        title={`Delete video "${v.title}"?`}
                        description="This background video will be permanently deleted."
                        onConfirm={() => deleteVideoMutation.mutate(v._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                    {isVideosLoading ? "Loading background videos…" : "No custom background videos uploaded yet. (Using default video)"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SECTION 2: HERO CARDS & SHOWCASE SLIDES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border pt-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Hero Showcase Banners</h2>
            <p className="text-xs text-muted-foreground">
              These 4 cards power the homepage's animated showcase. Order controls their display sequence.
            </p>
          </div>
          <Button onClick={() => setEditing(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 cursor-pointer">
            <Plus className="size-4" /> Add Hero Card
          </Button>
        </div>

        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold">Order</TableHead>
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Sub-items</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length ? (
                  items.map((item, i) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" disabled={i === 0} onClick={() => move(i, -1)} className="size-7">
                            <ArrowUp className="size-3" />
                          </Button>
                          <Button variant="outline" size="icon" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="size-7">
                            <ArrowDown className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.image?.url && (
                          <img
                            src={cloudinaryUrl(item.image.url, 80)}
                            alt=""
                            className="size-10 rounded-md object-cover border border-border"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{item.items.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="outline" size="icon" onClick={() => setEditing(item)} className="size-8 cursor-pointer">
                            <Pencil className="size-3.5" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button variant="destructive" size="icon" className="size-8 cursor-pointer">
                                <Trash2 className="size-3.5" />
                              </Button>
                            }
                            title={`Delete "${item.name}"?`}
                            description="This cannot be undone."
                            onConfirm={() => deleteMutation.mutate(item._id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      {isItemsLoading ? "Loading hero cards…" : "No hero cards yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: HOMEPAGE ABOUT COMPANY */}
      <div className="space-y-4 border-t border-border pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-foreground">About Company Section</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage the "About Company" section displayed on the homepage, including headline text, paragraphs, button CTA, and hero carousel images.
            </p>
          </div>
          <Button
            onClick={() => setEditAboutOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 cursor-pointer"
          >
            <Pencil className="size-4" /> Edit About Company
          </Button>
        </div>

        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-6">
            {isAboutLoading ? (
              <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin mr-2" /> Loading About Company content…
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {aboutData?.badge && (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                        Badge: {aboutData.badge}
                      </span>
                    )}
                    {aboutData?.title && (
                      <span className="text-sm font-extrabold text-foreground">
                        Title: {aboutData.title}{" "}
                        {aboutData.highlightWord && (
                          <span className="text-emerald-600 font-bold">
                            (Highlight: "{aboutData.highlightWord}")
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {aboutData?.leadText && (
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Lead Paragraph
                      </h4>
                      <p className="text-sm font-medium text-foreground bg-muted/30 p-3 rounded-lg border border-border/50 leading-relaxed">
                        {aboutData.leadText}
                      </p>
                    </div>
                  )}

                  {aboutData?.bodyText && (
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Body Paragraph
                      </h4>
                      <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/50 leading-relaxed">
                        {aboutData.bodyText}
                      </p>
                    </div>
                  )}

                  {aboutData?.buttonText && (
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-foreground pt-1">
                      <div>
                        <span className="text-muted-foreground">Button Label: </span>
                        <strong className="text-emerald-600">{aboutData.buttonText}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Carousel Images ({aboutData?.images?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {aboutData?.images?.map((img, i) => (
                      <div key={i} className="relative group overflow-hidden rounded-lg border border-border bg-black/5 aspect-video">
                        <img
                          src={cloudinaryUrl(img.url.startsWith("http") ? img.url : getImage(img.url), 300)}
                          alt={img.alt || "About image"}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/75 px-1.5 py-1 text-[10px] text-white truncate">
                          {img.alt || `Image ${i + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* DIALOG 1: ADD HERO BACKGROUND VIDEO */}
      {addVideoOpen && (
        <AddHeroVideoDialog onClose={() => setAddVideoOpen(false)} />
      )}

      {/* DIALOG 2: EDIT / ADD HERO CARD */}
      {editing !== undefined && (
        <HeroFormDialog item={editing} nextOrder={items?.length ?? 0} onClose={() => setEditing(undefined)} />
      )}

      {/* DIALOG 3: EDIT ABOUT COMPANY */}
      {editAboutOpen && (
        <EditAboutCompanyDialog about={aboutData} onClose={() => setEditAboutOpen(false)} />
      )}
    </div>
  )
}

function AddHeroVideoDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.post("/hero/videos", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroVideos"] })
      toast.success("Background video added successfully")
      onClose()
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Video upload failed"),
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (videoFile) formData.set("video", videoFile)
    mutation.mutate(formData)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add Hero Background Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">Video Title</Label>
            <Input id="title" name="title" placeholder="e.g. Falling Spices & Dry Fruits HD" required className="h-9 text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Upload MP4 Video File</Label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold cursor-pointer"
              >
                {videoFile ? videoFile.name : "Select MP4 File"}
              </Button>
              {videoFile && <span className="text-xs text-emerald-600 font-semibold">File selected</span>}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer pt-1">
            <Checkbox name="isActive" defaultChecked value="true" />
            Set as Active Homepage Background Video
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
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
                  Uploading Video…
                </>
              ) : (
                "Save Background Video"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface DraftSubItem {
  name: string
  description: string
  existingImage?: HeroSubItem["image"]
  file: File | null
  previewUrl: string | null
}

function HeroFormDialog({
  item,
  nextOrder,
  onClose,
}: {
  item: HeroItem | null
  nextOrder: number
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const isEdit = !!item
  const [mainFile, setMainFile] = useState<File | null>(null)
  const [subItems, setSubItems] = useState<DraftSubItem[]>(
    item?.items.map((it) => ({ name: it.name, description: it.description, existingImage: it.image, file: null, previewUrl: null })) ?? []
  )

  const mutation = useMutation({
    mutationFn: (formData: FormData) => (isEdit ? api.put(`/hero/${item!._id}`, formData) : api.post("/hero", formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroItems"] })
      toast.success(isEdit ? "Hero card updated" : "Hero card created")
      onClose()
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Save failed"),
  })

  function addSubItem() {
    setSubItems((prev) => [...prev, { name: "", description: "", file: null, previewUrl: null }])
  }

  function removeSubItem(index: number) {
    setSubItems((prev) => prev.filter((_, i) => i !== index))
  }

  function updateSubItem(index: number, patch: Partial<DraftSubItem>) {
    setSubItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (mainFile) formData.set("image", mainFile)

    const itemsMeta = subItems.map((it) => ({
      name: it.name,
      description: it.description,
      image: it.file ? undefined : it.existingImage,
    }))
    formData.set("items", JSON.stringify(itemsMeta))
    subItems.forEach((it, i) => {
      if (it.file) formData.append(`item_${i}`, it.file)
    })

    mutation.mutate(formData)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Hero Card" : "Add Hero Card"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
          <input type="hidden" name="order" value={item?.order ?? nextOrder} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={item?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eyebrow">Eyebrow</Label>
              <Input id="eyebrow" name="eyebrow" defaultValue={item?.eyebrow} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titleLine1">Title Line 1</Label>
              <Input id="titleLine1" name="titleLine1" defaultValue={item?.titleLine1} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleLine2">Title Line 2</Label>
              <Input id="titleLine2" name="titleLine2" defaultValue={item?.titleLine2} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="blurb">Blurb</Label>
            <Textarea id="blurb" name="blurb" defaultValue={item?.blurb} rows={2} required />
          </div>
          <ImageUploadField label="Main Image" currentUrl={item?.image?.url} onChange={setMainFile} />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tint">Tint Color</Label>
              <Input id="tint" name="tint" type="color" defaultValue={item?.tint || "#ea580c"} className="h-8 p-1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input id="badge" name="badge" defaultValue={item?.badge} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price Label</Label>
              <Input id="price" name="price" defaultValue={item?.price} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input id="rating" name="rating" defaultValue={item?.rating} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewsCount">Reviews Count</Label>
              <Input id="reviewsCount" name="reviewsCount" defaultValue={item?.reviewsCount} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep / Shipping</Label>
              <Input id="prepTime" name="prepTime" defaultValue={item?.prepTime} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories Tag</Label>
              <Input id="calories" name="calories" defaultValue={item?.calories} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spiceLevel">Spice Level Tag</Label>
              <Input id="spiceLevel" name="spiceLevel" defaultValue={item?.spiceLevel} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={item?.description} rows={3} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
            <Input id="ingredients" name="ingredients" defaultValue={item?.ingredients.join(", ")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL (optional)</Label>
            <Input id="videoUrl" name="videoUrl" defaultValue={item?.videoUrl} />
          </div>

          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <Label>Sub-items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSubItem}>
                <Plus className="size-3.5" /> Add
              </Button>
            </div>
            {subItems.map((sub, i) => (
              <div key={i} className="space-y-2 rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Item {i + 1}</span>
                  <Button type="button" variant="ghost" size="icon-xs" onClick={() => removeSubItem(i)}>
                    <X className="size-3.5" />
                  </Button>
                </div>
                <Input
                  placeholder="Name"
                  value={sub.name}
                  onChange={(e) => updateSubItem(i, { name: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Description"
                  rows={2}
                  value={sub.description}
                  onChange={(e) => updateSubItem(i, { description: e.target.value })}
                  required
                />
                <ImageUploadField
                  label="Image"
                  currentUrl={sub.existingImage?.url}
                  onChange={(file) => updateSubItem(i, { file })}
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "Saving…" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditAboutCompanyDialog({
  about,
  onClose,
}: {
  about: AboutCompany | undefined
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [badge, setBadge] = useState(about?.badge || "")
  const [title, setTitle] = useState(about?.title || "")
  const [highlightWord, setHighlightWord] = useState(about?.highlightWord || "")
  const [leadText, setLeadText] = useState(about?.leadText || "")
  const [bodyText, setBodyText] = useState(about?.bodyText || "")
  const [buttonText, setButtonText] = useState(about?.buttonText || "")
  const [buttonLink, setButtonLink] = useState(about?.buttonLink || "/about-us")

  const [existingImages, setExistingImages] = useState<AboutCompanyImage[]>(about?.images || [])

  const [newImages, setNewImages] = useState<{ file: File; previewUrl: string; alt: string }[]>([])
  const newFileInputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.put("/about", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutCompany"] })
      toast.success("About Company section updated successfully!")
      onClose()
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update About Company"),
  })

  function handleAddNewImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setNewImages((prev) => [...prev, { file, previewUrl, alt: "" }])
    if (newFileInputRef.current) newFileInputRef.current.value = ""
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData()
    formData.set("badge", badge)
    formData.set("title", title)
    formData.set("highlightWord", highlightWord)
    formData.set("leadText", leadText)
    formData.set("bodyText", bodyText)
    formData.set("buttonText", buttonText)
    formData.set("buttonLink", buttonLink)

    formData.set("existingImages", JSON.stringify(existingImages))
    formData.set(
      "newImagesMeta",
      JSON.stringify(newImages.map((n) => ({ alt: n.alt })))
    )

    newImages.forEach((n, idx) => {
      formData.append(`new_image_${idx}`, n.file)
    })

    mutation.mutate(formData)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit About Company Section</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="badge" className="text-xs font-semibold">Badge Tag</Label>
              <Input
                id="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Who We Are"
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs font-semibold">Main Heading</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. About Company"
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="highlightWord" className="text-xs font-semibold">Highlighted Title Word</Label>
              <Input
                id="highlightWord"
                value={highlightWord}
                onChange={(e) => setHighlightWord(e.target.value)}
                placeholder="e.g. Company"
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="leadText" className="text-xs font-semibold">Lead Paragraph (Bold Top Text)</Label>
            <Textarea
              id="leadText"
              value={leadText}
              onChange={(e) => setLeadText(e.target.value)}
              rows={3}
              className="text-xs leading-relaxed"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="bodyText" className="text-xs font-semibold">Body Paragraph (Detailed Description)</Label>
            <Textarea
              id="bodyText"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={4}
              className="text-xs leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="buttonText" className="text-xs font-semibold">CTA Button Label</Label>
              <Input
                id="buttonText"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Read More"
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="buttonLink" className="text-xs font-semibold">CTA Button Link</Label>
              <Input
                id="buttonLink"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                placeholder="/about-us"
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          {/* Carousel Images Manager */}
          <div className="space-y-3 rounded-lg border border-border p-3.5 bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold">About Carousel Images</Label>
                <p className="text-[11px] text-muted-foreground">Images displayed on the left side of the About Company section</p>
              </div>
              <input
                ref={newFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAddNewImage}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => newFileInputRef.current?.click()}
                className="text-xs font-semibold cursor-pointer gap-1"
              >
                <Plus className="size-3.5" /> Add New Image
              </Button>
            </div>

            {/* List Existing Images */}
            <div className="space-y-2">
              {existingImages.map((img, index) => (
                <div key={index} className="flex items-center justify-between gap-3 bg-background p-2.5 rounded-md border border-border">
                  <div className="flex items-center gap-3">
                    <img
                      src={cloudinaryUrl(img.url.startsWith("http") ? img.url : getImage(img.url), 100)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-12 rounded object-cover border border-border shrink-0"
                    />
                    <span className="text-xs font-semibold text-foreground">Existing Image {index + 1}</span>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setExistingImages((prev) => prev.filter((_, i) => i !== index))}
                    className="size-7 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}

              {/* List New Image Uploads */}
              {newImages.map((img, index) => (
                <div key={index} className="flex items-center justify-between gap-3 bg-emerald-500/5 p-2.5 rounded-md border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <img
                      src={img.previewUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-12 rounded object-cover border border-emerald-500/40 shrink-0"
                    />
                    <span className="text-xs font-bold text-emerald-600">New Image to Upload {index + 1}</span>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== index))}
                    className="size-7 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}

              {existingImages.length === 0 && newImages.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-3">
                  No images added. Click "Add New Image" to upload carousel images.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer gap-1.5"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving Changes…
                </>
              ) : (
                "Save About Company Section"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

