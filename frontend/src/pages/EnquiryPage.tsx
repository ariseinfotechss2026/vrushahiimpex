import { PageMeta } from "@/components/PageMeta"
import { EnquiryForm } from "@/components/forms/EnquiryForm"
import { useSiteSettings, useContactUsPage } from "@/lib/queries"
import {
  Clock,
  PackageCheck,
  Award,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"

export function EnquiryPage() {
  const { data: settings } = useSiteSettings()
  const { data: contactData } = useContactUsPage()
  const company = settings?.companyInfo

  const supportTitle = contactData?.enquirySupportTitle || ""
  const supportSubtitle = contactData?.enquirySupportSubtitle || ""

  const supportFeatures = contactData?.enquirySupportFeatures || []

  const tradeDeskTitle = contactData?.enquiryTradeDeskTitle || ""
  const tradeDeskPhone = contactData?.enquiryTradeDeskPhone || company?.phone || ""
  const tradeDeskEmail = contactData?.enquiryTradeDeskEmail || company?.emails?.[0] || ""
  const tradeDeskLocation = contactData?.enquiryTradeDeskLocation || ""

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case "Clock":
        return <Clock className="size-4" />
      case "PackageCheck":
        return <PackageCheck className="size-4" />
      case "Award":
        return <Award className="size-4" />
      case "ShieldCheck":
        return <ShieldCheck className="size-4" />
      default:
        return <CheckCircle2 className="size-4" />
    }
  }

  return (
    <>
      <PageMeta
        title="Product Enquiry | Vrushahi Impex - Merchant Exporter"
        description="Send a product enquiry to Vrushahi Impex for bulk import/export orders of Indian spices, herbs, dry fruits, fresh produce, honey, millets and handicrafts."
      />

      {/* Main Enquiry Content Layout (Form + Quick Trade Sidebar) */}
      <section className="relative bg-background py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Sidebar Trade Info (Left Column) */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              {/* Trust Features Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#059669]" /> {supportTitle}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {supportSubtitle}
                </p>

                <div className="mt-4 flex flex-col gap-4">
                  {supportFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#059669]/10 text-[#059669]">
                        {getFeatureIcon(feat.icon)}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-foreground">{feat.title}</h3>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Trade Desk Contact Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {tradeDeskTitle}
                </h3>

                <div className="mt-3 flex flex-col gap-3.5 text-xs">
                  <a
                    href={`tel:${tradeDeskPhone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-3 font-semibold text-foreground hover:text-[#059669] transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-[#059669] shrink-0">
                      <PhoneCall className="size-4" />
                    </div>
                    <span className="break-all">{tradeDeskPhone}</span>
                  </a>

                  <a
                    href={`mailto:${tradeDeskEmail}`}
                    className="flex items-center gap-3 font-semibold text-foreground hover:text-[#059669] transition-colors min-w-0"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-[#059669] shrink-0">
                      <Mail className="size-4" />
                    </div>
                    <span className="truncate">{tradeDeskEmail}</span>
                  </a>

                  <div className="flex items-center gap-3 font-medium text-muted-foreground min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-[#059669] shrink-0">
                      <MapPin className="size-4" />
                    </div>
                    <span className="truncate">{tradeDeskLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Container (Right Column) */}
            <div className="lg:col-span-8">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
                <div className="mb-2.5 pb-2 border-b border-border/60 flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">
                    Submit Product Enquiry
                  </h2>
                  <span className="text-[10px] font-semibold text-[#059669] flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Fast Response
                  </span>
                </div>

                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
