import { useLegalPage } from "@/lib/queries"
import { ShieldCheck, Clock, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function PrivacyPolicyPage() {
  const { data: page, isLoading, error } = useLegalPage("privacy-policy")

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <Loader2 className="size-6 animate-spin" />
          <span className="text-sm font-medium">Loading Privacy Policy...</span>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center px-4">
        <ShieldAlert className="size-12 text-rose-500" />
        <h2 className="text-2xl font-bold text-foreground">Privacy Policy Unavailable</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Unable to load policy content at this moment. Please check back shortly or contact our trade desk.
        </p>
        <Button render={<Link to="/" />}>Return Home</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-10 pt-2">
      {/* Header Banner */}
      <section className="border-b border-border/40 bg-gradient-to-b from-emerald-950/20 via-background to-background py-5 sm:py-7">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {page.badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>{page.badge}</span>
            </div>
          )}

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {page.subtitle}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock className="size-3.5 text-emerald-500" />
            <span>Last Updated: {page.lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Clean Compact Document Container */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-5">
        <div className="rounded-xl border border-border/60 bg-card p-5 sm:p-7 shadow-xs">
          <div className="divide-y divide-border/50">
            {page.sections && page.sections.length > 0 ? (
              page.sections.map((sec, idx) => (
                <div key={sec._id || idx} className="py-4 first:pt-0 last:pb-0">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    <span>{sec.heading}</span>
                  </h2>
                  <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground whitespace-pre-line pl-6">
                    {sec.body}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No privacy policy sections listed yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
