import { Link } from "react-router-dom"
import {
  Award,
  ShieldCheck,
  Globe,
  Sparkles,
  CheckCircle2,
  Target,
  Compass,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react"
import { PageMeta } from "@/components/PageMeta"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { getImage } from "@/assets/images"
import { useAboutUsPage } from "@/lib/queries"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Award,
  Globe,
  Sparkles,
  CheckCircle2,
  Target,
  Compass,
}

export function AboutPage() {
  const { data: pageData } = useAboutUsPage()

  const storyBadge = pageData?.storyBadge || ""
  const storyTitleLine1 = pageData?.storyTitleLine1 || ""
  const storyTitleHighlight = pageData?.storyTitleHighlight || ""
  const storyParagraph1 = pageData?.storyParagraph1 || ""
  const storyParagraph2 = pageData?.storyParagraph2 || ""
  const certifications = pageData?.certifications || []
  const heroImageUrl =
    pageData?.heroImage?.url
      ? pageData.heroImage.url.startsWith("http")
        ? cloudinaryUrl(pageData.heroImage.url, 800)
        : getImage(pageData.heroImage.url)
      : ""

  const heroCaptionTitle = pageData?.heroImageCaptionTitle || ""
  const heroCaptionSub = pageData?.heroImageCaptionSub || ""
  const ctaButtonText = pageData?.ctaButtonText || ""
  const ctaButtonLink = pageData?.ctaButtonLink || "/contact-us"

  const standardsBadge = pageData?.standardsBadge || ""
  const standardsTitle = pageData?.standardsTitle || ""
  const standardsDescription = pageData?.standardsDescription || ""
  const coreValues = pageData?.coreValues || []

  const missionTitle = pageData?.missionTitle || ""
  const missionDescription = pageData?.missionDescription || ""
  const visionTitle = pageData?.visionTitle || ""
  const visionDescription = pageData?.visionDescription || ""

  return (
    <>
      <PageMeta
        title="About Us | Vrushahi Impex - Premier Merchant Exporter in India"
        description="Learn about Vrushahi Impex, a certified Indian merchant exporter supplying spices, dry fruits, fresh produce, and handicrafts worldwide."
      />

      {/* Story & Experience Section */}
      <section className="pt-6 sm:pt-10 pb-12 sm:pb-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2 lg:gap-14">
            
            {/* Left Column: Story Text */}
            <div className="space-y-5">
              {storyBadge && (
                <div className="flex items-center gap-2.5">
                  <span className="h-[2px] w-7 bg-[#059669] rounded-full" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                    {storyBadge}
                  </span>
                </div>
              )}
              
              {(storyTitleLine1 || storyTitleHighlight) && (
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.2]">
                  {storyTitleLine1} {storyTitleLine1 && <br />}
                  <span className="text-[#059669]">{storyTitleHighlight}</span>
                </h1>
              )}
              
              {storyParagraph1 && (
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {storyParagraph1}
                </p>
              )}
              
              {storyParagraph2 && (
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {storyParagraph2}
                </p>
              )}

              {certifications.length > 0 && (
                <div className="pt-1 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {certifications.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 shrink-0 text-[#059669]" />
                      <span className="text-xs font-semibold text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {ctaButtonText && (
                <div className="pt-3">
                  <Button render={<Link to={ctaButtonLink} />} size="lg" className="rounded-full px-7 py-5 text-sm font-semibold gap-2 shadow-md shadow-emerald-500/20 bg-[#059669] text-white hover:bg-[#047857] border-0">
                    {ctaButtonText} <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column: Image Card */}
            {heroImageUrl && (
              <div>
                <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-border/80 shadow-2xl group">
                  <OptimizedImage
                    src={heroImageUrl}
                    alt={heroCaptionTitle || "Vrushahi Impex"}
                    targetWidth={800}
                    srcSetWidths={[400, 600, 800, 1000]}
                    priority
                    className="h-64 sm:h-[450px] w-full object-cover transition-transform duration-700 hover:scale-105"
                    containerClassName="h-64 sm:h-[450px] w-full"
                  />
                  
                  {/* Dark Gradient Overlay for Caption */}
                  {(heroCaptionTitle || heroCaptionSub) && (
                    <>
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                      
                      <div className="absolute bottom-5 left-5 text-white z-10">
                        {heroCaptionTitle && (
                          <p className="text-sm font-bold tracking-wide drop-shadow-md">
                            {heroCaptionTitle}
                          </p>
                        )}
                        {heroCaptionSub && (
                          <p className="text-xs text-slate-300 font-medium drop-shadow mt-0.5">
                            {heroCaptionSub}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Core Values / Why Choose Us Grid */}
      {(standardsTitle || coreValues.length > 0) && (
        <section className="bg-secondary/40 pt-8 pb-6 sm:pt-10 sm:pb-8 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {(standardsTitle || standardsBadge || standardsDescription) && (
              <div className="mx-auto max-w-3xl text-center">
                {standardsBadge && (
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {standardsBadge}
                  </span>
                )}
                {standardsTitle && (
                  <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {standardsTitle}
                  </h2>
                )}
                {standardsDescription && (
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    {standardsDescription}
                  </p>
                )}
              </div>
            )}

            {coreValues.length > 0 && (
              <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {coreValues.map((val, idx) => {
                  const Icon = ICON_MAP[val.icon] || ShieldCheck
                  return (
                    <div
                      key={idx}
                      className="group rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-emerald-50/80 hover:border-emerald-300"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-foreground group-hover:text-emerald-950 transition-colors">
                        {val.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {val.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Mission & Vision Section */}
      {(missionTitle || visionTitle) && (
        <section className="py-8 sm:py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Mission Card */}
              {missionTitle && (
                <div className="group rounded-2xl border border-border bg-gradient-to-br from-background to-secondary/30 p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <Target className="size-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">{missionTitle}</h3>
                  </div>
                  {missionDescription && (
                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {missionDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Vision Card */}
              {visionTitle && (
                <div className="group rounded-2xl border border-border bg-gradient-to-br from-background to-secondary/30 p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <Compass className="size-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">{visionTitle}</h3>
                  </div>
                  {visionDescription && (
                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {visionDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
