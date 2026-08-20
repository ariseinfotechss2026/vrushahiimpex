import { useState, type FormEvent, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Save,
  Loader2,
  PanelBottom,
  Share2,
  Phone,
} from "lucide-react"
import { useFooterSettings } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function FooterAdminPage() {
  const { data: footerData, isLoading } = useFooterSettings()
  const queryClient = useQueryClient()

  // State
  const [brandDescription, setBrandDescription] = useState("")
  const [facebookUrl, setFacebookUrl] = useState("")
  const [showFacebook, setShowFacebook] = useState(true)
  const [instagramUrl, setInstagramUrl] = useState("")
  const [showInstagram, setShowInstagram] = useState(true)
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [showLinkedin, setShowLinkedin] = useState(true)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [showYoutube, setShowYoutube] = useState(true)

  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactAddress, setContactAddress] = useState("")

  const [copyrightText, setCopyrightText] = useState("")

  useEffect(() => {
    if (footerData) {
      setBrandDescription(footerData.brandDescription || "")
      setFacebookUrl(footerData.facebookUrl || "")
      setShowFacebook(footerData.showFacebook !== undefined ? footerData.showFacebook : true)
      setInstagramUrl(footerData.instagramUrl || "")
      setShowInstagram(footerData.showInstagram !== undefined ? footerData.showInstagram : true)
      setLinkedinUrl(footerData.linkedinUrl || "")
      setShowLinkedin(footerData.showLinkedin !== undefined ? footerData.showLinkedin : true)
      setYoutubeUrl(footerData.youtubeUrl || "")
      setShowYoutube(footerData.showYoutube !== undefined ? footerData.showYoutube : true)

      setContactPhone(footerData.contactPhone || "")
      setContactEmail(footerData.contactEmail || "")
      setContactAddress(footerData.contactAddress || "")

      setCopyrightText(footerData.copyrightText || "")
    }
  }, [footerData])

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.put("/footer-settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footerSettings"] })
      toast.success("Footer settings updated successfully!")
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Failed to update footer settings"),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      brandDescription,
      facebookUrl,
      showFacebook,
      instagramUrl,
      showInstagram,
      linkedinUrl,
      showLinkedin,
      youtubeUrl,
      showYoutube,
      contactPhone,
      contactEmail,
      contactAddress,
      copyrightText,
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-emerald-600" />
        <span className="ml-2 text-sm text-muted-foreground">Loading Footer configuration…</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Footer Management</h2>
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md shadow-emerald-600/20"
        >
          {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Footer Settings
        </Button>
      </div>

      {/* 1. Brand Description & Social Links */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Share2 className="size-5 text-emerald-600" />
            <CardTitle className="text-lg">1. Brand & Social Links</CardTitle>
          </div>
          <CardDescription>Brand intro text and social media profile URLs with visibility toggles.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brandDescription">Footer Brand Description</Label>
            <Textarea
              id="brandDescription"
              rows={3}
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              placeholder="Vrushahi Impex is a leading merchant exporter..."
            />
          </div>

          {/* Social Links List */}
          <div className="space-y-4 pt-2">
            <Label className="text-sm font-bold text-foreground">Social Profiles & Visibility</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facebook */}
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">Facebook</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFacebook}
                      onChange={(e) => setShowFacebook(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-[11px] font-semibold text-muted-foreground">
                      {showFacebook ? "Visible" : "Hidden"}
                    </span>
                  </label>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="facebookUrl" className="text-[11px] text-muted-foreground">Facebook Profile Link</Label>
                  <Input
                    id="facebookUrl"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/..."
                    disabled={!showFacebook}
                    className={!showFacebook ? "opacity-50" : ""}
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-pink-600/10 text-pink-600">
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">Instagram</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInstagram}
                      onChange={(e) => setShowInstagram(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-[11px] font-semibold text-muted-foreground">
                      {showInstagram ? "Visible" : "Hidden"}
                    </span>
                  </label>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="instagramUrl" className="text-[11px] text-muted-foreground">Instagram Profile Link</Label>
                  <Input
                    id="instagramUrl"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                    disabled={!showInstagram}
                    className={!showInstagram ? "opacity-50" : ""}
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-700/10 text-blue-700">
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">LinkedIn</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showLinkedin}
                      onChange={(e) => setShowLinkedin(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-[11px] font-semibold text-muted-foreground">
                      {showLinkedin ? "Visible" : "Hidden"}
                    </span>
                  </label>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="linkedinUrl" className="text-[11px] text-muted-foreground">LinkedIn Profile Link</Label>
                  <Input
                    id="linkedinUrl"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/..."
                    disabled={!showLinkedin}
                    className={!showLinkedin ? "opacity-50" : ""}
                  />
                </div>
              </div>

              {/* YouTube */}
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">YouTube</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showYoutube}
                      onChange={(e) => setShowYoutube(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-[11px] font-semibold text-muted-foreground">
                      {showYoutube ? "Visible" : "Hidden"}
                    </span>
                  </label>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="youtubeUrl" className="text-[11px] text-muted-foreground">YouTube Channel Link</Label>
                  <Input
                    id="youtubeUrl"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    disabled={!showYoutube}
                    className={!showYoutube ? "opacity-50" : ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Contact Information Column */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Phone className="size-5 text-emerald-600" />
            <CardTitle className="text-lg">2. Contact Column Information</CardTitle>
          </div>
          <CardDescription>Contact details displayed under the CONTACT column in footer.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone Number Display</Label>
            <Input
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 88067 37015"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Official Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="info.vrushahiimpex@vrushahi.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactAddress">Footer Address</Label>
            <Textarea
              id="contactAddress"
              rows={2}
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder="Flat No 5, Rahul App, Nagaraj Colony 100Ft Street, Vishrambag, Sangli 416416."
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Bottom Bar Copyright */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <PanelBottom className="size-5 text-emerald-600" />
            <CardTitle className="text-lg">3. Bottom Bar Copyright</CardTitle>
          </div>
          <CardDescription>Copyright statement displayed at the bottom of the page.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copyrightText">Copyright Text</Label>
            <Input
              id="copyrightText"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              placeholder="© 2026 Vrushahi Impex Pvt. Ltd. All rights reserved."
            />
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
