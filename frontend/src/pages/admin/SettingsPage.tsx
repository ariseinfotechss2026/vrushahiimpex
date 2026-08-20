import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSiteSettings } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploadField } from "@/components/admin/ImageUploadField"

export function SettingsPage() {
  const { data: settings, isLoading } = useSiteSettings()
  const [file, setFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.put("/settings", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] })
      toast.success("Settings saved")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Save failed"),
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (file) formData.set("logo", file)
    mutation.mutate(formData)
  }

  if (isLoading || !settings) return <p className="text-sm text-muted-foreground">Loading…</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadField label="Logo" currentUrl={settings.companyInfo.logo?.url} onChange={setFile} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" name="name" defaultValue={settings.companyInfo.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={settings.companyInfo.tagline} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (display)</Label>
              <Input id="phone" name="phone" defaultValue={settings.companyInfo.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneHref">Phone (tel: link)</Label>
              <Input id="phoneHref" name="phoneHref" defaultValue={settings.companyInfo.phoneHref} placeholder="tel:+91..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emails">Emails (comma-separated)</Label>
            <Input id="emails" name="emails" defaultValue={settings.companyInfo.emails.join(", ")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLines">Address (one line each)</Label>
            <Textarea id="addressLines" name="addressLines" rows={3} defaultValue={settings.companyInfo.addressLines.join("\n")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapEmbedSrc">Google Maps Embed URL</Label>
            <Input id="mapEmbedSrc" name="mapEmbedSrc" defaultValue={settings.companyInfo.mapEmbedSrc} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" name="facebook" defaultValue={settings.socialLinks.facebook} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" name="instagram" defaultValue={settings.socialLinks.instagram} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" name="linkedin" defaultValue={settings.socialLinks.linkedin} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  )
}
