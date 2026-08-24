import { NavLink } from "react-router-dom"
import { useSiteSettings } from "@/lib/queries"
import {
  LayoutDashboard,
  MailCheck,
  Tags,
  PlusCircle,
  Package,
  Sparkles,
  Newspaper,
  Mail,
  Info,
  PhoneCall,
  PanelBottom,
  UserCircle,
  FileText,
  ShieldCheck,
} from "lucide-react"

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/contact-us-details", label: "Contact Us Details", icon: MailCheck },
  { to: "/admin/enquiries", label: "Product Enquiry", icon: Mail },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/add-product", label: "Add Product", icon: PlusCircle },
  { to: "/admin/products", label: "Highlight Service", icon: Package },
  { to: "/admin/hero", label: "Homepage Hero", icon: Sparkles },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/about-us", label: "About Us Page", icon: Info },
  { to: "/admin/contact-us", label: "ContactUs Management", icon: PhoneCall },
  { to: "/admin/footer", label: "Footer Management", icon: PanelBottom },
  { to: "/admin/terms-and-conditions", label: "Terms & Conditions", icon: FileText },
  { to: "/admin/privacy-policy", label: "Privacy Policy", icon: ShieldCheck },
  { to: "/admin/account", label: "Account", icon: UserCircle },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm"
    : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100"
  }`

export function AdminSidebarNav({ onNavClick }: { onNavClick?: () => void }) {
  const { data: settings } = useSiteSettings()
  const logoUrl = settings?.companyInfo?.logo?.url

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 border-b border-zinc-800/80 px-5 py-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              loading="eager"
              decoding="async"
              className="h-14 w-auto max-w-[160px] object-contain"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="size-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">Vrushahi Impex</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={onNavClick} className={linkClass}>
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`size-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200"
                        }`}
                    />
                    <span className="whitespace-nowrap">{label}</span>
                    {isActive && (
                      <span className="ml-auto size-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}


