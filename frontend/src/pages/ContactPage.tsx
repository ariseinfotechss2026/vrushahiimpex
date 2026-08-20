import { useState } from "react"
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react"
import { PageMeta } from "@/components/PageMeta"
import { ContactForm } from "@/components/forms/ContactForm"
import { useSiteSettings, useContactUsPage } from "@/lib/queries"

export function ContactPage() {
  const { data: settings } = useSiteSettings()
  const { data: contactData } = useContactUsPage()
  const company = settings?.companyInfo

  const heroBadge = contactData?.heroBadge || ""
  const heroTitle = contactData?.heroTitle || ""
  const heroSubtitle = contactData?.heroSubtitle || ""

  const hqBadge = contactData?.headquartersBadge || ""
  const hqTitle = contactData?.headquartersTitle || ""
  const hqAddress = contactData?.headquartersAddress || company?.addressLines?.join(", ") || ""
  const hqMapUrl = contactData?.headquartersMapUrl || ""

  const phoneBadge = contactData?.phoneBadge || ""
  const phoneTitle = contactData?.phoneTitle || ""
  const phoneNumber = contactData?.phoneNumber || company?.phone || ""
  const phoneHours = contactData?.phoneHours || ""
  const phoneCallHref = contactData?.phoneCallHref || company?.phoneHref || ""
  const whatsappNumber = contactData?.whatsappNumber || ""

  const emailBadge = contactData?.emailBadge || ""
  const emailTitle = contactData?.emailTitle || ""
  const primaryEmail = contactData?.primaryEmail || company?.emails?.[0] || ""
  const secondaryEmail = contactData?.secondaryEmail || company?.emails?.[1] || ""

  const formBadge = contactData?.formBadge || ""
  const formTitle = contactData?.formTitle || ""
  const formSubtitle = contactData?.formSubtitle || ""

  const faqBadge = contactData?.faqBadge || ""
  const faqTitle = contactData?.faqTitle || ""
  const faqSubtitle = contactData?.faqSubtitle || ""

  const faqs = contactData?.faqs || []
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true })

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  return (
    <>
      <PageMeta
        title="Contact Us | Vrushahi Impex - Global Merchant Exporter in India"
        description="Get in touch with Vrushahi Impex for wholesale export inquiries, pricing quotes, and custom agro-commodity orders from Sangli, Maharashtra, India."
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-[#0a1128] py-12 text-white sm:py-20">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#059669]/40 bg-[#059669]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#10b981]">
            <Globe className="size-3.5" /> {heroBadge}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white">
            {heroTitle}
          </h1>
          <p className="mt-3 text-sm text-slate-300 w-full max-w-2xl text-center mx-auto sm:text-base leading-relaxed font-medium">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Quick Contact Info Cards */}
      <section className="relative -mt-6 sm:-mt-8 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* Card 1: Address */}
          <div className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-emerald-50/90 hover:border-emerald-500 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#059669]/10 text-[#059669] group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <MapPin className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-950 transition-colors truncate">
                  {hqBadge}
                </h3>
                <p className="text-sm font-semibold text-foreground group-hover:text-emerald-950 transition-colors mt-0.5 truncate">
                  {hqTitle}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground group-hover:text-slate-700 transition-colors break-words">
              {hqAddress}
            </p>
            <div className="mt-4 pt-3 border-t border-border/60">
              <a
                href={hqMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] group-hover:text-emerald-800 hover:underline"
              >
                View on Google Maps <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-emerald-50/90 hover:border-emerald-500 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#059669]/10 text-[#059669] group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Phone className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-950 transition-colors truncate">
                  {phoneBadge}
                </h3>
                <p className="text-sm font-semibold text-foreground group-hover:text-emerald-950 transition-colors mt-0.5 truncate">
                  {phoneTitle}
                </p>
              </div>
            </div>
            <p className="mt-4 text-base font-extrabold text-foreground group-hover:text-emerald-950 transition-colors tracking-wide break-all">
              {phoneNumber}
            </p>
            <p className="mt-1 text-xs text-muted-foreground group-hover:text-slate-700 transition-colors">
              {phoneHours}
            </p>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap">
              <a
                href={phoneCallHref}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669] group-hover:text-emerald-800 hover:underline"
              >
                Direct Call <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:text-emerald-800 hover:underline"
              >
                WhatsApp Chat <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Email Support */}
          <div className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-emerald-50/90 hover:border-emerald-500 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#059669]/10 text-[#059669] group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Mail className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-950 transition-colors truncate">
                  {emailBadge}
                </h3>
                <p className="text-sm font-semibold text-foreground group-hover:text-emerald-950 transition-colors mt-0.5 truncate">
                  {emailTitle}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <a
                href={`mailto:${primaryEmail}`}
                className="block text-xs font-medium text-foreground group-hover:text-emerald-950 transition-colors break-all"
              >
                {primaryEmail}
              </a>
              {secondaryEmail && (
                <a
                  href={`mailto:${secondaryEmail}`}
                  className="block text-xs font-medium text-foreground group-hover:text-emerald-950 transition-colors break-all"
                >
                  {secondaryEmail}
                </a>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-border/60">
              <a
                href={`mailto:${primaryEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] group-hover:text-emerald-800 hover:underline"
              >
                Send Email Quote <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section: Centered Form */}
      <section className="pt-6 sm:pt-10 pb-6 sm:pb-8 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xl">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
                {formBadge}
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {formTitle}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {formSubtitle}
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section (Interactive Collapsible Accordion) */}
      {faqs.length > 0 && (
        <section className="bg-secondary/40 pt-8 sm:pt-12 pb-12 sm:pb-16 border-t border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#059669]">
                {faqBadge}
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {faqTitle}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                {faqSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, idx) => {
                const isOpen = !!openFaqs[idx]
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-border/80 bg-background shadow-xs transition-all duration-300 hover:border-emerald-500/40"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                        {faq.question}
                      </h3>
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? "bg-[#059669] text-white rotate-180 shadow-sm"
                            : "bg-secondary text-muted-foreground hover:bg-emerald-100 hover:text-emerald-800"
                        }`}
                      >
                        <ChevronDown className="size-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="border-t border-border/50 pt-3">
                          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
