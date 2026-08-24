import { useState, useRef, type FormEvent, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Target,
  Compass,
  Building2,
} from "lucide-react"
import { useAboutUsPage, type CoreValueItem } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { getImage } from "@/assets/images"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const ICON_OPTIONS = [
  { label: "Shield Check (Quality)", value: "ShieldCheck" },
  { label: "Award (Certifications)", value: "Award" },
  { label: "Globe (Global Logistics)", value: "Globe" },
  { label: "Sparkles (Trust & Benefits)", value: "Sparkles" },
  { label: "Check Circle", value: "CheckCircle2" },
  { label: "Target (Mission)", value: "Target" },
  { label: "Compass (Vision)", value: "Compass" },
]

export function AboutUsAdminPage() {
  const { data: pageData, isLoading } = useAboutUsPage()
  const queryClient = useQueryClient()

  // Form states
  const [storyBadge, setStoryBadge] = useState("")
  const [storyTitleLine1, setStoryTitleLine1] = useState("")
  const [storyTitleHighlight, setStoryTitleHighlight] = useState("")
  const [storyParagraph1, setStoryParagraph1] = useState("")
  const [storyParagraph2, setStoryParagraph2] = useState("")
  const [certifications, setCertifications] = useState<string[]>([])
  const [newCertText, setNewCertText] = useState("")

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null)
  const [heroImageCaptionTitle, setHeroImageCaptionTitle] = useState("")
  const [heroImageCaptionSub, setHeroImageCaptionSub] = useState("")

  const [ctaButtonText, setCtaButtonText] = useState("")
  const [ctaButtonLink, setCtaButtonLink] = useState("")

  const [standardsBadge, setStandardsBadge] = useState("")
  const [standardsTitle, setStandardsTitle] = useState("")
  const [standardsDescription, setStandardsDescription] = useState("")
  const [coreValues, setCoreValues] = useState<CoreValueItem[]>([])

  const [missionTitle, setMissionTitle] = useState("")
  const [missionDescription, setMissionDescription] = useState("")
  const [visionTitle, setVisionTitle] = useState("")
  const [visionDescription, setVisionDescription] = useState("")

  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (pageData) {
      setStoryBadge(pageData.storyBadge || "")
      setStoryTitleLine1(pageData.storyTitleLine1 || "")
      setStoryTitleHighlight(pageData.storyTitleHighlight || "")
      setStoryParagraph1(pageData.storyParagraph1 || "")
      setStoryParagraph2(pageData.storyParagraph2 || "")
      setCertifications(pageData.certifications || [])

      setHeroImageCaptionTitle(pageData.heroImageCaptionTitle || "")
      setHeroImageCaptionSub(pageData.heroImageCaptionSub || "")
      setCtaButtonText(pageData.ctaButtonText || "")
      setCtaButtonLink(pageData.ctaButtonLink || "/contact-us")

      setStandardsBadge(pageData.standardsBadge || "")
      setStandardsTitle(pageData.standardsTitle || "")
      setStandardsDescription(pageData.standardsDescription || "")
      setCoreValues(pageData.coreValues || [])

      setMissionTitle(pageData.missionTitle || "")
      setMissionDescription(pageData.missionDescription || "")
      setVisionTitle(pageData.visionTitle || "")
      setVisionDescription(pageData.visionDescription || "")
    }
  }, [pageData])

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.put("/about-us-page", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutUsPage"] })
      toast.success("About Us Page updated successfully!")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update About Us Page"),
  })

  function handleAddCert() {
    if (!newCertText.trim()) return
    setCertifications((prev) => [...prev, newCertText.trim()])
    setNewCertText("")
  }

  function handleRemoveCert(index: number) {
    setCertifications((prev) => prev.filter((_, i) => i !== index))
  }

  function handleAddCoreValue() {
    setCoreValues((prev) => [
      ...prev,
      { icon: "ShieldCheck", title: "New Feature / Value", description: "Enter feature description..." },
    ])
  }

  function handleRemoveCoreValue(index: number) {
    setCoreValues((prev) => prev.filter((_, i) => i !== index))
  }

  function handleUpdateCoreValue(index: number, patch: Partial<CoreValueItem>) {
    setCoreValues((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setHeroImageFile(f)
    setHeroImagePreview(URL.createObjectURL(f))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    formData.set("storyBadge", storyBadge)
    formData.set("storyTitleLine1", storyTitleLine1)
    formData.set("storyTitleHighlight", storyTitleHighlight)
    formData.set("storyParagraph1", storyParagraph1)
    formData.set("storyParagraph2", storyParagraph2)
    formData.set("certifications", JSON.stringify(certifications))

    if (heroImageFile) {
      formData.set("heroImage", heroImageFile)
    }
    formData.set("heroImageCaptionTitle", heroImageCaptionTitle)
    formData.set("heroImageCaptionSub", heroImageCaptionSub)
    formData.set("ctaButtonText", ctaButtonText)
    formData.set("ctaButtonLink", ctaButtonLink)

    formData.set("standardsBadge", standardsBadge)
    formData.set("standardsTitle", standardsTitle)
    formData.set("standardsDescription", standardsDescription)
    formData.set("coreValues", JSON.stringify(coreValues))

    formData.set("missionTitle", missionTitle)
    formData.set("missionDescription", missionDescription)
    formData.set("visionTitle", visionTitle)
    formData.set("visionDescription", visionDescription)

    mutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2 text-emerald-600" /> Loading About Us Page configuration…
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Top Sticky Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">About Us Page Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage all content, hero story text, certifications, plant image, standards cards, and mission/vision on the /about-us page.
          </p>
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 cursor-pointer shadow-sm"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving Changes…
            </>
          ) : (
            <>
              <Save className="size-4" /> Save About Us Page
            </>
          )}
        </Button>
      </div>

      {/* SECTION 1: STORY & HERITAGE */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-base font-bold">1. Story & Heritage Section</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Manage top banner headline, story text, certifications list, and hero plant image.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Story Badge Tag</Label>
              <Input
                value={storyBadge}
                onChange={(e) => setStoryBadge(e.target.value)}
                placeholder="e.g. OUR STORY & HERITAGE"
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Title Line 1</Label>
              <Input
                value={storyTitleLine1}
                onChange={(e) => setStoryTitleLine1(e.target.value)}
                placeholder="e.g. Born in Sangli, India."
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Title Highlighted Line 2</Label>
              <Input
                value={storyTitleHighlight}
                onChange={(e) => setStoryTitleHighlight(e.target.value)}
                placeholder="e.g. Trusted across the globe."
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Story Paragraph 1 (Lead Text)</Label>
            <Textarea
              value={storyParagraph1}
              onChange={(e) => setStoryParagraph1(e.target.value)}
              rows={3}
              className="text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Story Paragraph 2 (Details)</Label>
            <Textarea
              value={storyParagraph2}
              onChange={(e) => setStoryParagraph2(e.target.value)}
              rows={3}
              className="text-xs leading-relaxed"
            />
          </div>

          {/* Certifications Manager */}
          <div className="space-y-2 rounded-lg border border-border p-3.5 bg-muted/20">
            <Label className="text-xs font-bold">Certifications & Highlights Checklist</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {certifications.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 bg-background p-2 rounded-md border border-border text-xs">
                  <span className="font-medium truncate">{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveCert(idx)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Input
                value={newCertText}
                onChange={(e) => setNewCertText(e.target.value)}
                placeholder="Enter new certification / tag (e.g. ISO 22000 Certified)"
                className="h-8 text-xs flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCert()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCert}
                className="h-8 text-xs font-semibold gap-1 cursor-pointer"
              >
                <Plus className="size-3.5" /> Add
              </Button>
            </div>
          </div>

          {/* Plant Hero Image & Captions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Plant / Facility Hero Image</Label>
              <div className="flex items-center gap-3">
                <div className="relative size-24 rounded-lg overflow-hidden border border-border bg-black/5 shrink-0">
                  <img
                    src={
                      heroImagePreview ||
                      (pageData?.heroImage?.url
                        ? pageData.heroImage.url.startsWith("http")
                          ? pageData.heroImage.url
                          : getImage(pageData.heroImage.url)
                        : getImage("about.jpg"))
                    }
                    alt="About Hero"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  className="text-xs font-semibold cursor-pointer gap-1.5"
                >
                  <ImageIcon className="size-3.5" /> Change Hero Image
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Image Caption Title</Label>
                <Input
                  value={heroImageCaptionTitle}
                  onChange={(e) => setHeroImageCaptionTitle(e.target.value)}
                  placeholder="e.g. Vrushahi Impex Plant • Sangli, Maharashtra"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Image Caption Subtitle</Label>
                <Input
                  value={heroImageCaptionSub}
                  onChange={(e) => setHeroImageCaptionSub(e.target.value)}
                  placeholder="e.g. Central Export Processing Facility"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="border-t border-border pt-3">
            <div className="space-y-1 max-w-md">
              <Label className="text-xs font-semibold">CTA Button Label</Label>
              <Input
                value={ctaButtonText}
                onChange={(e) => setCtaButtonText(e.target.value)}
                placeholder="Partner With Us"
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: OUR STANDARDS & CORE VALUES */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">2. Our Standards & Core Values Section</CardTitle>
              <CardDescription className="text-xs">
                Manage section header and 4 core value cards (Micro-sterilization, Certifications, Supply chain, etc.).
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCoreValue}
              className="text-xs font-semibold gap-1 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Core Value Card
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Section Tag / Badge</Label>
              <Input
                value={standardsBadge}
                onChange={(e) => setStandardsBadge(e.target.value)}
                placeholder="OUR STANDARDS"
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Section Heading Title</Label>
              <Input
                value={standardsTitle}
                onChange={(e) => setStandardsTitle(e.target.value)}
                placeholder="Why Global Importers Choose Vrushahi Impex"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Section Subtitle / Description</Label>
            <Textarea
              value={standardsDescription}
              onChange={(e) => setStandardsDescription(e.target.value)}
              rows={2}
              className="text-xs leading-relaxed"
            />
          </div>

          {/* Cards Manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {coreValues.map((val, idx) => (
              <div key={idx} className="space-y-3 rounded-lg border border-border p-3.5 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 uppercase">Card {idx + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveCoreValue(idx)}
                    className="text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Icon</Label>
                    <select
                      value={val.icon}
                      onChange={(e) => handleUpdateCoreValue(idx, { icon: e.target.value })}
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none cursor-pointer"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Title</Label>
                    <Input
                      value={val.title}
                      onChange={(e) => handleUpdateCoreValue(idx, { title: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Description</Label>
                  <Textarea
                    value={val.description}
                    onChange={(e) => handleUpdateCoreValue(idx, { description: e.target.value })}
                    rows={2}
                    className="text-xs leading-relaxed resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: MISSION & VISION */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">3. Mission & Vision Section</CardTitle>
          <CardDescription className="text-xs">
            Manage Our Mission and Our Vision statement titles & descriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Box */}
            <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-emerald-600" />
                <Label className="text-xs font-bold">Mission Section</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Title</Label>
                <Input
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  placeholder="Our Mission"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Description</Label>
                <Textarea
                  value={missionDescription}
                  onChange={(e) => setMissionDescription(e.target.value)}
                  rows={4}
                  className="text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Vision Box */}
            <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-emerald-600" />
                <Label className="text-xs font-bold">Vision Section</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Title</Label>
                <Input
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                  placeholder="Our Vision"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Description</Label>
                <Textarea
                  value={visionDescription}
                  onChange={(e) => setVisionDescription(e.target.value)}
                  rows={4}
                  className="text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 cursor-pointer px-6 shadow-sm"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving Changes…
            </>
          ) : (
            <>
              <Save className="size-4" /> Save About Us Page
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
