import { useState, type FormEvent, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  Globe,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  Building2,
} from "lucide-react"
import { useContactUsPage, type FaqItem, type EnquiryFeatureItem } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function ContactUsAdminPage() {
  const { data: pageData, isLoading } = useContactUsPage()
  const queryClient = useQueryClient()

  // Hero Section State
  const [heroBadge, setHeroBadge] = useState("")
  const [heroTitle, setHeroTitle] = useState("")
  const [heroSubtitle, setHeroSubtitle] = useState("")

  // Headquarters State
  const [headquartersBadge, setHeadquartersBadge] = useState("")
  const [headquartersTitle, setHeadquartersTitle] = useState("")
  const [headquartersAddress, setHeadquartersAddress] = useState("")
  const [headquartersMapUrl, setHeadquartersMapUrl] = useState("")

  // Call & WhatsApp State
  const [phoneBadge, setPhoneBadge] = useState("")
  const [phoneTitle, setPhoneTitle] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneHours, setPhoneHours] = useState("")
  const [phoneCallHref, setPhoneCallHref] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")

  // Official Email State
  const [emailBadge, setEmailBadge] = useState("")
  const [emailTitle, setEmailTitle] = useState("")
  const [primaryEmail, setPrimaryEmail] = useState("")
  const [secondaryEmail, setSecondaryEmail] = useState("")

  // Form Section State
  const [formBadge, setFormBadge] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [formSubtitle, setFormSubtitle] = useState("")

  // Product Enquiry Page Sidebar State
  const [enquirySupportTitle, setEnquirySupportTitle] = useState("")
  const [enquirySupportSubtitle, setEnquirySupportSubtitle] = useState("")
  const [enquirySupportFeatures, setEnquirySupportFeatures] = useState<EnquiryFeatureItem[]>([])
  const [enquiryTradeDeskTitle, setEnquiryTradeDeskTitle] = useState("")
  const [enquiryTradeDeskPhone, setEnquiryTradeDeskPhone] = useState("")
  const [enquiryTradeDeskEmail, setEnquiryTradeDeskEmail] = useState("")
  const [enquiryTradeDeskLocation, setEnquiryTradeDeskLocation] = useState("")

  // FAQ Section State
  const [faqBadge, setFaqBadge] = useState("")
  const [faqTitle, setFaqTitle] = useState("")
  const [faqSubtitle, setFaqSubtitle] = useState("")
  const [faqs, setFaqs] = useState<FaqItem[]>([])

  useEffect(() => {
    if (pageData) {
      setHeroBadge(pageData.heroBadge || "")
      setHeroTitle(pageData.heroTitle || "")
      setHeroSubtitle(pageData.heroSubtitle || "")

      setHeadquartersBadge(pageData.headquartersBadge || "")
      setHeadquartersTitle(pageData.headquartersTitle || "")
      setHeadquartersAddress(pageData.headquartersAddress || "")
      setHeadquartersMapUrl(pageData.headquartersMapUrl || "")

      setPhoneBadge(pageData.phoneBadge || "")
      setPhoneTitle(pageData.phoneTitle || "")
      setPhoneNumber(pageData.phoneNumber || "")
      setPhoneHours(pageData.phoneHours || "")
      setPhoneCallHref(pageData.phoneCallHref || "")
      setWhatsappNumber(pageData.whatsappNumber || "")

      setEmailBadge(pageData.emailBadge || "")
      setEmailTitle(pageData.emailTitle || "")
      setPrimaryEmail(pageData.primaryEmail || "")
      setSecondaryEmail(pageData.secondaryEmail || "")

      setFormBadge(pageData.formBadge || "")
      setFormTitle(pageData.formTitle || "")
      setFormSubtitle(pageData.formSubtitle || "")

      setEnquirySupportTitle(pageData.enquirySupportTitle || "")
      setEnquirySupportSubtitle(pageData.enquirySupportSubtitle || "")
      setEnquirySupportFeatures(pageData.enquirySupportFeatures || [])
      setEnquiryTradeDeskTitle(pageData.enquiryTradeDeskTitle || "")
      setEnquiryTradeDeskPhone(pageData.enquiryTradeDeskPhone || "")
      setEnquiryTradeDeskEmail(pageData.enquiryTradeDeskEmail || "")
      setEnquiryTradeDeskLocation(pageData.enquiryTradeDeskLocation || "")

      setFaqBadge(pageData.faqBadge || "")
      setFaqTitle(pageData.faqTitle || "")
      setFaqSubtitle(pageData.faqSubtitle || "")
      setFaqs(pageData.faqs || [])
    }
  }, [pageData])

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.put("/contact-us-page", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactUsPage"] })
      toast.success("Contact Us Page updated successfully!")
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Failed to update Contact Us Page"),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validate FAQs
    for (let i = 0; i < faqs.length; i++) {
      if (!faqs[i].question.trim() || !faqs[i].answer.trim()) {
        toast.error(`FAQ #${i + 1} must have both a question and an answer.`)
        return
      }
    }

    // Validate Features
    for (let i = 0; i < enquirySupportFeatures.length; i++) {
      if (!enquirySupportFeatures[i].title.trim() || !enquirySupportFeatures[i].description.trim()) {
        toast.error(`Support Feature #${i + 1} must have both a title and description.`)
        return
      }
    }

    mutation.mutate({
      heroBadge,
      heroTitle,
      heroSubtitle,
      headquartersBadge,
      headquartersTitle,
      headquartersAddress,
      headquartersMapUrl,
      phoneBadge,
      phoneTitle,
      phoneNumber,
      phoneHours,
      phoneCallHref,
      whatsappNumber,
      emailBadge,
      emailTitle,
      primaryEmail,
      secondaryEmail,
      formBadge,
      formTitle,
      formSubtitle,
      enquirySupportTitle,
      enquirySupportSubtitle,
      enquirySupportFeatures,
      enquiryTradeDeskTitle,
      enquiryTradeDeskPhone,
      enquiryTradeDeskEmail,
      enquiryTradeDeskLocation,
      faqBadge,
      faqTitle,
      faqSubtitle,
      faqs,
    })
  }

  // Feature Handlers
  const handleAddEnquiryFeature = () => {
    setEnquirySupportFeatures([...enquirySupportFeatures, { icon: "Clock", title: "", description: "" }])
  }

  const handleUpdateEnquiryFeature = (
    index: number,
    field: "icon" | "title" | "description",
    value: string
  ) => {
    const updated = [...enquirySupportFeatures]
    updated[index][field] = value
    setEnquirySupportFeatures(updated)
  }

  const handleRemoveEnquiryFeature = (index: number) => {
    setEnquirySupportFeatures(enquirySupportFeatures.filter((_, i) => i !== index))
  }

  // FAQ Handlers
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const handleUpdateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs]
    updated[index][field] = value
    setFaqs(updated)
  }

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-emerald-600" />
        <span className="ml-2 text-sm text-muted-foreground">Loading Contact Us Page content…</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Contact Us Page Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage public contact header, quick info cards, inquiry form section, and dynamic FAQ content.
          </p>
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md shadow-emerald-600/20"
        >
          {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Contact Us Page
        </Button>
      </div>

      {/* 1. Hero Header Banner */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="size-5 text-emerald-600" />
            <CardTitle className="text-lg">1. Hero Header Banner</CardTitle>
          </div>
          <CardDescription>Top banner presented to visitors when they land on Contact Us.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroBadge">Badge / Top Tagline</Label>
              <Input
                id="heroBadge"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="DIRECT GLOBAL EXPORT SUPPORT"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Main Heading</Label>
              <Input
                id="heroTitle"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Connect With Our Export Desk"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subheading / Description</Label>
            <Textarea
              id="heroSubtitle"
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Have a wholesale inquiry, custom packaging request..."
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Headquarters Info Card */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-emerald-600" />
            <CardTitle className="text-lg">2. Headquarters Card</CardTitle>
          </div>
          <CardDescription>Physical office & plant address with map link.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headquartersBadge">Card Badge</Label>
              <Input
                id="headquartersBadge"
                value={headquartersBadge}
                onChange={(e) => setHeadquartersBadge(e.target.value)}
                placeholder="HEADQUARTERS"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headquartersTitle">City / Location Title</Label>
              <Input
                id="headquartersTitle"
                value={headquartersTitle}
                onChange={(e) => setHeadquartersTitle(e.target.value)}
                placeholder="Sangli, Maharashtra"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="headquartersAddress">Full Address Text</Label>
            <Textarea
              id="headquartersAddress"
              rows={2}
              value={headquartersAddress}
              onChange={(e) => setHeadquartersAddress(e.target.value)}
              placeholder="Flat No 5, Rahul App., Nagaraj Colony..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="headquartersMapUrl">Google Maps URL</Label>
            <Input
              id="headquartersMapUrl"
              value={headquartersMapUrl}
              onChange={(e) => setHeadquartersMapUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Call & WhatsApp Info Card */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Phone className="size-5 text-emerald-600" />
            <CardTitle className="text-lg">3. Call & WhatsApp Card</CardTitle>
          </div>
          <CardDescription>Trade desk phone line, working hours, and direct call/WhatsApp links.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneBadge">Card Badge</Label>
              <Input
                id="phoneBadge"
                value={phoneBadge}
                onChange={(e) => setPhoneBadge(e.target.value)}
                placeholder="CALL & WHATSAPP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneTitle">Subtitle / Line Name</Label>
              <Input
                id="phoneTitle"
                value={phoneTitle}
                onChange={(e) => setPhoneTitle(e.target.value)}
                placeholder="Trade Desk Line"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number Display</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 88067 37015"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneHours">Operating Hours / Note</Label>
              <Input
                id="phoneHours"
                value={phoneHours}
                onChange={(e) => setPhoneHours(e.target.value)}
                placeholder="Mon – Sat: 9:00 AM – 7:00 PM IST"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneCallHref">Direct Call Href (e.g., tel:+918806737015)</Label>
              <Input
                id="phoneCallHref"
                value={phoneCallHref}
                onChange={(e) => setPhoneCallHref(e.target.value)}
                placeholder="tel:+918806737015"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number (e.g. 918806737015)</Label>
              <Input
                id="whatsappNumber"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="918806737015"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Official Email Card */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-emerald-600" />
            <CardTitle className="text-lg">4. Official Email Card</CardTitle>
          </div>
          <CardDescription>Primary and secondary email addresses for quotes and specifications.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailBadge">Card Badge</Label>
              <Input
                id="emailBadge"
                value={emailBadge}
                onChange={(e) => setEmailBadge(e.target.value)}
                placeholder="OFFICIAL EMAIL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailTitle">Subtitle / Category</Label>
              <Input
                id="emailTitle"
                value={emailTitle}
                onChange={(e) => setEmailTitle(e.target.value)}
                placeholder="Quotes & Specs"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryEmail">Primary Email</Label>
              <Input
                id="primaryEmail"
                type="email"
                value={primaryEmail}
                onChange={(e) => setPrimaryEmail(e.target.value)}
                placeholder="info.vrushahiimpex@vrushahi.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryEmail">Secondary Email</Label>
              <Input
                id="secondaryEmail"
                type="email"
                value={secondaryEmail}
                onChange={(e) => setSecondaryEmail(e.target.value)}
                placeholder="vrushahiimpex@gmail.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Product Enquiry Sidebar Management */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-emerald-600" />
            <CardTitle className="text-lg">5. Product Enquiry Sidebar Management</CardTitle>
          </div>
          <CardDescription>Manage the sidebar features card and trade desk details on the Product Enquiry page.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Direct Export Support Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enquirySupportTitle">Direct Support Title</Label>
              <Input
                id="enquirySupportTitle"
                value={enquirySupportTitle}
                onChange={(e) => setEnquirySupportTitle(e.target.value)}
                placeholder="Direct Export Support"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enquirySupportSubtitle">Direct Support Subtitle</Label>
              <Input
                id="enquirySupportSubtitle"
                value={enquirySupportSubtitle}
                onChange={(e) => setEnquirySupportSubtitle(e.target.value)}
                placeholder="Partner with Vrushahi Impex for seamless global trade..."
              />
            </div>
          </div>

          {/* Support Features List */}
          <div className="space-y-4 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Support Features ({enquirySupportFeatures.length})</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEnquiryFeature}
                className="gap-1 border-emerald-600/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs"
              >
                <Plus className="size-3.5" /> Add Feature
              </Button>
            </div>

            {enquirySupportFeatures.map((feat, index) => (
              <div
                key={index}
                className="rounded-xl border border-border/80 bg-card p-4 space-y-3 relative shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-600">Feature #{index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEnquiryFeature(index)}
                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Icon</Label>
                    <select
                      value={feat.icon}
                      onChange={(e) => handleUpdateEnquiryFeature(index, "icon", e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="Clock">Clock (Quotation Turnaround)</option>
                      <option value="PackageCheck">PackageCheck (OEM & Packaging)</option>
                      <option value="Award">Award (Certifications & Quality)</option>
                      <option value="ShieldCheck">ShieldCheck (Security)</option>
                      <option value="CheckCircle2">CheckCircle (Verification)</option>
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs font-medium">Title</Label>
                    <Input
                      value={feat.title}
                      onChange={(e) => handleUpdateEnquiryFeature(index, "title", e.target.value)}
                      placeholder="e.g. 24-Hour Quotation Turnaround"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Description</Label>
                  <Input
                    value={feat.description}
                    onChange={(e) => handleUpdateEnquiryFeature(index, "description", e.target.value)}
                    placeholder="e.g. Fast FOB / CIF rates & port lead times."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Trade Desk Contact Info */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <Label className="text-sm font-semibold">Trade Desk Contact Info</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enquiryTradeDeskTitle">Trade Desk Card Title</Label>
                <Input
                  id="enquiryTradeDeskTitle"
                  value={enquiryTradeDeskTitle}
                  onChange={(e) => setEnquiryTradeDeskTitle(e.target.value)}
                  placeholder="TRADE DESK CONTACT"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enquiryTradeDeskPhone">Trade Desk Phone</Label>
                <Input
                  id="enquiryTradeDeskPhone"
                  value={enquiryTradeDeskPhone}
                  onChange={(e) => setEnquiryTradeDeskPhone(e.target.value)}
                  placeholder="+91 88067 37015"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enquiryTradeDeskEmail">Trade Desk Email</Label>
                <Input
                  id="enquiryTradeDeskEmail"
                  type="email"
                  value={enquiryTradeDeskEmail}
                  onChange={(e) => setEnquiryTradeDeskEmail(e.target.value)}
                  placeholder="info.vrushahiimpex@vrushahi.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enquiryTradeDeskLocation">Trade Desk Location</Label>
                <Input
                  id="enquiryTradeDeskLocation"
                  value={enquiryTradeDeskLocation}
                  onChange={(e) => setEnquiryTradeDeskLocation(e.target.value)}
                  placeholder="Sangli, Maharashtra, India"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Frequently Asked Questions (FAQs) */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-4 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-emerald-600" />
              <CardTitle className="text-lg">6. Frequently Asked Questions (FAQs)</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Add, edit, or remove FAQ items displayed at the bottom of the Contact Us page.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddFaq}
            className="gap-1.5 border-emerald-600/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            <Plus className="size-4" /> Add FAQ
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="faqBadge">FAQ Section Badge</Label>
              <Input
                id="faqBadge"
                value={faqBadge}
                onChange={(e) => setFaqBadge(e.target.value)}
                placeholder="FREQUENTLY ASKED QUESTIONS"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faqTitle">FAQ Main Title</Label>
              <Input
                id="faqTitle"
                value={faqTitle}
                onChange={(e) => setFaqTitle(e.target.value)}
                placeholder="Export Trade Guidance for Global Buyers"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="faqSubtitle">FAQ Subtitle / Summary</Label>
            <Textarea
              id="faqSubtitle"
              rows={2}
              value={faqSubtitle}
              onChange={(e) => setFaqSubtitle(e.target.value)}
              placeholder="Common questions answered regarding ordering..."
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <Label className="text-base font-semibold">FAQ Items ({faqs.length})</Label>

            {faqs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No FAQ items present. Click "Add FAQ" above to create one.
              </div>
            ) : (
              faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      FAQ #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFaq(index)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(index, "question", e.target.value)}
                      placeholder="e.g. What payment terms do you support?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Answer</Label>
                    <Textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(index, "answer", e.target.value)}
                      placeholder="e.g. We accept Letter of Credit (L/C)..."
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
