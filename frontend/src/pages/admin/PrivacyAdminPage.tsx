import { useState, useEffect, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Save,
  Loader2,
  ShieldCheck,
  Plus,
  Trash2,
  Info,
  Clock,
  Sparkles,
} from "lucide-react"
import { useLegalPage, type LegalSectionItem } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function PrivacyAdminPage() {
  const { data: pageData, isLoading } = useLegalPage("privacy-policy")
  const queryClient = useQueryClient()

  // State
  const [badge, setBadge] = useState("PRIVACY POLICY")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [lastUpdated, setLastUpdated] = useState("")
  const [sections, setSections] = useState<LegalSectionItem[]>([])

  useEffect(() => {
    if (pageData) {
      setBadge(pageData.badge || "")
      setTitle(pageData.title || "")
      setSubtitle(pageData.subtitle || "")
      setLastUpdated(pageData.lastUpdated || "")
      setSections(pageData.sections || [])
    }
  }, [pageData])

  // Handlers for dynamic sections
  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        heading: `${sections.length + 1}. New Privacy Policy Heading`,
        body: "Enter detailed privacy handling, data retention, or security terms here.",
      },
    ])
  }

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const handleSectionChange = (index: number, field: "heading" | "body", value: string) => {
    const updated = [...sections]
    updated[index][field] = value
    setSections(updated)
  }

  // Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      return api.put("/legal/privacy-policy", {
        badge,
        title,
        subtitle,
        lastUpdated,
        sections,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legalPage", "privacy-policy"] })
      toast.success("Privacy Policy page updated successfully!")
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to update Privacy Policy page.")
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="size-6 text-emerald-500" />
            Privacy Policy Page CMS
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage public Privacy Policy guidelines, user data protection protocols, and confidentiality disclosures.
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={saveMutation.isPending} className="gap-2 shrink-0">
          {saveMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {saveMutation.isPending ? "Saving..." : "Save Privacy Page"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header & Meta Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-500" />
              Page Header & Subtitle
            </CardTitle>
            <CardDescription>
              Configure top hero header elements displayed on the public Privacy Policy page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="badge">Header Badge Text</Label>
                <Input
                  id="badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. PRIVACY POLICY"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lastUpdated">Last Updated Date</Label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="lastUpdated"
                    value={lastUpdated}
                    onChange={(e) => setLastUpdated(e.target.value)}
                    placeholder="e.g. August 19, 2026"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Privacy & Data Protection Policy"
                className="mt-1 font-semibold"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle / Intro Blurb</Label>
              <Textarea
                id="subtitle"
                rows={3}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Brief introduction explaining data protection commitment..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Sections Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="size-4 text-emerald-500" />
                Privacy Sections & Disclosure Clauses
              </CardTitle>
              <CardDescription>
                Add, edit, or remove specific policy disclosure sections.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSection}
              className="gap-1.5"
            >
              <Plus className="size-4" /> Add Disclosure Section
            </Button>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {sections.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No privacy sections added yet. Click &quot;Add Disclosure Section&quot; above to create one.
              </div>
            ) : (
              sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card/60 p-4 sm:p-5 space-y-4 relative"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Privacy Disclosure Section #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSection(idx)}
                      className="h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1"
                    >
                      <Trash2 className="size-4" /> Remove
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor={`sec-heading-${idx}`}>Section Heading</Label>
                    <Input
                      id={`sec-heading-${idx}`}
                      value={sec.heading}
                      onChange={(e) => handleSectionChange(idx, "heading", e.target.value)}
                      placeholder="e.g. 1. Information We Collect"
                      className="mt-1 font-medium"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`sec-body-${idx}`}>Section Detailed Body Text</Label>
                    <Textarea
                      id={`sec-body-${idx}`}
                      rows={4}
                      value={sec.body}
                      onChange={(e) => handleSectionChange(idx, "body", e.target.value)}
                      placeholder="Enter detailed privacy guidelines..."
                      className="mt-1"
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Save Footer Action */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saveMutation.isPending} size="lg" className="gap-2">
            {saveMutation.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Save className="size-5" />
            )}
            {saveMutation.isPending ? "Saving Changes..." : "Save Privacy Page"}
          </Button>
        </div>
      </form>
    </div>
  )
}
