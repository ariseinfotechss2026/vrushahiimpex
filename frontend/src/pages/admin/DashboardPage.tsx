import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ShoppingBag,
  Package,
  Tags,
  Newspaper,
  Mail,
  Clock,
  CheckCircle2,
  Inbox,
  MessageSquare,
  TrendingUp,
  Calendar,
  Activity,
  ArrowRight,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { useStats, type Stats } from "@/lib/queries"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const OVERVIEW_CARDS = [
  {
    key: "totalCategoryProducts" as keyof Stats,
    label: "Total Products",
    icon: ShoppingBag,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
    border: "hover:border-emerald-500/40",
  },
  {
    key: "totalProducts" as keyof Stats,
    label: "Highlight Services",
    icon: Package,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-400",
    border: "hover:border-cyan-500/40",
  },
  {
    key: "totalCategories" as keyof Stats,
    label: "Categories",
    icon: Tags,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
    border: "hover:border-blue-500/40",
  },
  {
    key: "totalPosts" as keyof Stats,
    label: "Blog Articles",
    icon: Newspaper,
    color: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
    border: "hover:border-purple-500/40",
  },
  {
    key: "newEnquiries" as keyof Stats,
    label: "Pending Enquiries",
    icon: Mail,
    color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
    border: "hover:border-amber-500/40",
  },
]

const SIX_STATUS_CARDS = [
  {
    key: "newContactUs" as keyof Stats,
    label: "New Contact Us",
    icon: Inbox,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
    border: "hover:border-emerald-500/40",
  },
  {
    key: "contactedContactUs" as keyof Stats,
    label: "Contacted Contact Us",
    icon: Clock,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400",
    border: "hover:border-amber-500/40",
  },
  {
    key: "closedContactUs" as keyof Stats,
    label: "Closed Contact Us",
    icon: CheckCircle2,
    color: "from-zinc-500/20 to-slate-500/20 text-zinc-600 dark:text-zinc-400",
    border: "hover:border-zinc-500/40",
  },
  {
    key: "newProductEnquiry" as keyof Stats,
    label: "New Product Enquiry",
    icon: MessageSquare,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
    border: "hover:border-emerald-500/40",
  },
  {
    key: "contactedProductEnquiry" as keyof Stats,
    label: "Contacted Product Enquiry",
    icon: Clock,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400",
    border: "hover:border-amber-500/40",
  },
  {
    key: "closedProductEnquiry" as keyof Stats,
    label: "Closed Product Enquiry",
    icon: CheckCircle2,
    color: "from-zinc-500/20 to-slate-500/20 text-zinc-600 dark:text-zinc-400",
    border: "hover:border-zinc-500/40",
  },
]

const YEAR_OPTIONS = Array.from({ length: 74 }, (_, i) => 2026 + i)

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/80 bg-background/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-40">
        <p className="font-bold text-foreground border-b border-border/60 pb-1">{label} Volume</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-semibold text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-extrabold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const DEFAULT_TIMELINE = [
  { month: "Jan", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Feb", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Mar", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Apr", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "May", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Jun", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Jul", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Aug", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Sep", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Oct", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Nov", "Product Enquiry": 0, "Contact Us": 0 },
  { month: "Dec", "Product Enquiry": 0, "Contact Us": 0 },
]

export function DashboardPage() {
  const currentYear = new Date().getFullYear()
  const initialYear = currentYear >= 2026 && currentYear <= 2099 ? currentYear : 2026
  const [selectedYear, setSelectedYear] = useState<number>(initialYear)

  const { data: stats, isLoading } = useStats(selectedYear)

  const timelineData = stats?.monthlyTimeline && stats.monthlyTimeline.length > 0
    ? stats.monthlyTimeline
    : DEFAULT_TIMELINE

  return (
    <div className="space-y-6">
      {/* General Catalog & Content Overview */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Overview</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {OVERVIEW_CARDS.map(({ key, label, icon: Icon, color, border }) => (
            <Card
              key={key}
              className={`relative overflow-hidden border-border/80 bg-card shadow-sm transition-all duration-300 ${border} hover:shadow-md`}
            >
              <CardContent className="p-3.5 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-snug whitespace-normal">{label}</p>
                    <p className="mt-1 text-lg font-extrabold tracking-tight text-foreground sm:text-2xl">
                      {isLoading ? "…" : ((stats as any)?.[key] ?? 0)}
                    </p>
                  </div>
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-sm ml-2`}>
                    <Icon className="size-4.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 6 Enquiry & Contact Status Cards in 1 Single Line Grid */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inquiries & Contact Status</h3>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {SIX_STATUS_CARDS.map(({ key, label, icon: Icon, color, border }) => (
            <Card
              key={key}
              className={`relative overflow-hidden border-border/80 bg-card shadow-sm transition-all duration-300 ${border} hover:shadow-md`}
            >
              <CardContent className="p-3 sm:p-3.5">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider leading-tight whitespace-normal break-words">
                      {label}
                    </p>
                    <p className="mt-1.5 text-lg font-extrabold tracking-tight text-foreground sm:text-2xl">
                      {isLoading ? "…" : ((stats as any)?.[key] ?? 0)}
                    </p>
                  </div>
                  <div className={`flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color} shadow-2xs mt-0.5`}>
                    <Icon className="size-3.5 sm:size-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recharts Smooth Area Gradient Chart with Year Filter */}
      <div className="pt-2">
        <Card className="border-border/80 shadow-sm overflow-hidden bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <TrendingUp className="size-4.5 text-sky-500" />
                  Enquiries & Contact Details Trajectory ({selectedYear})
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Monthly submission volume from Jan to Dec for the selected calendar year
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Year Filter Dropdown (2026 - 2099) */}
                <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-2.5 py-1 shadow-2xs">
                  <Calendar className="size-3.5 text-emerald-500" />
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">Year:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="h-6 rounded-lg bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                  >
                    {YEAR_OPTIONS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold bg-muted/40 px-3 py-1.5 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-sky-500 shadow-2xs" />
                    <span className="text-foreground">Product Enquiry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-purple-500 shadow-2xs" />
                    <span className="text-foreground">Contact Us</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">
            <div className="h-72 sm:h-80 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                  Loading monthly trajectory chart for {selectedYear}...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 20, right: 20, left: -15, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradientProductEnquiry" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="gradientContactUs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: "#cbd5e1", opacity: 0.3 }} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} axisLine={{ stroke: "#cbd5e1", opacity: 0.3 }} />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="Product Enquiry"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#gradientProductEnquiry)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Contact Us"
                      stroke="#a855f7"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#gradientContactUs)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest 5 Recent Activity Section */}
      <div className="pt-2">
        <Card className="border-border/80 shadow-sm overflow-hidden bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Activity className="size-4.5 text-emerald-500" />
                  Latest Recent Activity (Top 5)
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Latest Product Enquiries and Contact Us submissions received on portal
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/admin/enquiries"
                  className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 hover:underline transition-colors"
                >
                  View All Enquiries <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {isLoading ? (
                <div className="p-6 text-center text-xs text-muted-foreground">Loading recent activity...</div>
              ) : stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
                stats.recentEnquiries.slice(0, 5).map((item) => {
                  const isEnquiry = item.type === "enquiry"
                  return (
                    <div
                      key={item._id}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`size-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isEnquiry
                              ? "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                              : "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                          }`}
                        >
                          {isEnquiry ? <MessageSquare className="size-4" /> : <Inbox className="size-4" />}
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm text-foreground truncate">{item.name}</span>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                isEnquiry
                                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                                  : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                              }`}
                            >
                              {isEnquiry ? "Product Enquiry" : "Contact Us"}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 ml-auto sm:ml-0">
                              <Clock className="size-3" />
                              {new Date(item.createdAt).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground truncate" title={item.email}>
                            <span className="font-medium text-foreground">{item.email}</span>
                            {item.category ? ` • Category: ${item.category}` : ""}
                          </p>

                          {item.message && (
                            <p className="text-xs text-muted-foreground/80 line-clamp-1 italic">
                              "{item.message}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            item.status === "new"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : item.status === "contacted"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30"
                          }`}
                        >
                          {item.status}
                        </span>

                        <Link
                          to={isEnquiry ? "/admin/enquiries" : "/admin/contact-us-details"}
                          className="inline-flex items-center justify-center size-8 rounded-lg border border-border/60 bg-background/80 text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                          title="Open details page"
                        >
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">No recent activity found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
