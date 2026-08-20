import { Sparkles, type LucideIcon } from "lucide-react"

interface SectionHeadingProps {
  badge?: string
  icon?: LucideIcon
  title: string
  highlightWord?: string
  description?: string
  align?: "center" | "left" | "right"
  className?: string
}

export function SectionHeading({
  badge,
  icon: Icon = Sparkles,
  title,
  highlightWord,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClasses = {
    center: "text-center items-center",
    left: "text-left items-start",
    right: "text-right items-end",
  }

  const dividerAlignClasses = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end",
  }

  const renderTitle = () => {
    if (highlightWord && title.includes(highlightWord)) {
      const parts = title.split(highlightWord)
      return (
        <>
          {parts[0]}
          <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300">
            {highlightWord}
          </span>
          {parts[1]}
        </>
      )
    }

    const words = title.split(" ")
    if (words.length > 1) {
      const lastWord = words.pop()
      return (
        <>
          {words.join(" ")}{" "}
          <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300">
            {lastWord}
          </span>
        </>
      )
    }

    return title
  }

  return (
    <div className={`flex flex-col ${alignClasses[align]} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300/70 dark:border-emerald-800/60 rounded-full shadow-xs mb-3 transition-all hover:scale-105">
          <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          {badge}
        </span>
      )}

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
        {renderTitle()}
      </h2>

      {/* Decorative accent divider line */}
      <div className={`flex items-center gap-2 mt-3 mb-1 ${dividerAlignClasses[align]}`}>
        <span className="h-[2px] w-10 sm:w-14 bg-gradient-to-r from-transparent via-emerald-500 to-emerald-500 rounded-full" />
        <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 ring-4 ring-emerald-100 dark:ring-emerald-950/80" />
        <span className="h-[2px] w-10 sm:w-14 bg-gradient-to-l from-transparent via-emerald-500 to-emerald-500 rounded-full" />
      </div>

      {description && (
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-4xl md:whitespace-nowrap font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
