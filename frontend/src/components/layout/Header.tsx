import { useState, type ReactNode } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCategories, useSiteSettings } from "@/lib/queries"
import { getImage } from "@/assets/images"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold shadow-xs"
      : "text-foreground/80 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
  }`

export function Header() {
  const location = useLocation()
  const isProductsActive = location.pathname.startsWith("/products")
  const { data: categories } = useCategories()
  const { data: settings } = useSiteSettings()
  const productCategories = categories ?? []

  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(isProductsActive)

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-0.5 sm:py-1 sm:px-6">
        <Link to="/" className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
          <img
            src={cloudinaryUrl(settings?.companyInfo?.logo?.url, 300) || getImage("vrushahilogo.png")}
            alt={settings?.companyInfo?.name || "Vrushahi Impex"}
            width="160"
            height="68"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="h-16 sm:h-[68px] w-auto object-contain py-0.5"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about-us" className={navLinkClass}>
            About Us
          </NavLink>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isProductsActive
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold shadow-xs"
                      : "text-foreground/80 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
                  }`}
                />
              }
            >
              Products <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56 p-1">
              {productCategories.map((cat) => (
                <DropdownMenuItem
                  key={cat.slug}
                  render={<Link to={`/products/${cat.slug}`} />}
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 cursor-pointer"
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLink to="/blog" className={navLinkClass}>
            Blog
          </NavLink>
          <NavLink to="/contact-us" className={navLinkClass}>
            Contact Us
          </NavLink>
          <div className="ml-2">
            <Button render={<Link to="/enquiry" />} size="sm" className="hover:scale-[1.02] transition-transform duration-200">
              Product Enquiry
            </Button>
          </div>
        </nav>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={<Button variant="outline" size="icon" className="md:hidden" />}
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto p-5 bg-[#0a1128] text-white border-l border-slate-800/80 shadow-2xl">
            <SheetHeader className="p-0 pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Link to="/" onClick={() => setMobileOpen(false)} className="inline-block">
                <img
                  src={cloudinaryUrl(settings?.companyInfo?.logo?.url, 350) || getImage("vrushahilogo.png")}
                  alt={settings?.companyInfo?.name || "Vrushahi Impex"}
                  loading="lazy"
                  decoding="async"
                  className="h-14 sm:h-16 w-auto max-w-[170px] object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)] py-0.5"
                />
              </Link>
            </SheetHeader>

            <nav className="mt-5 flex flex-col gap-1.5">
              {/* 1. Home */}
              <SheetNavLink to="/" onClick={() => setMobileOpen(false)}>
                Home
              </SheetNavLink>

              {/* 2. About Us */}
              <SheetNavLink to="/about-us" onClick={() => setMobileOpen(false)}>
                About Us
              </SheetNavLink>

              {/* 3. Products Dropdown Accordion */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen((prev) => !prev)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isProductsActive
                      ? "bg-[#059669]/30 text-emerald-300 border border-emerald-500/40 font-semibold"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>Products</span>
                  <ChevronDown
                    className={`size-4 text-slate-400 transition-transform duration-200 ${
                      mobileProductsOpen ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>

                {mobileProductsOpen && (
                  <div className="ml-3 mt-1 pl-3 border-l-2 border-emerald-500/40 flex flex-col gap-1 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {productCategories.map((cat) => (
                      <SheetNavLink
                        key={cat.slug}
                        to={`/products/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        isSubItem
                      >
                        {cat.name}
                      </SheetNavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Blog */}
              <SheetNavLink to="/blog" onClick={() => setMobileOpen(false)}>
                Blog
              </SheetNavLink>

              {/* 5. Contact Us */}
              <SheetNavLink to="/contact-us" onClick={() => setMobileOpen(false)}>
                Contact Us
              </SheetNavLink>

              {/* 6. Product Enquiry CTA */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <Button
                  render={<Link to="/enquiry" onClick={() => setMobileOpen(false)} />}
                  className="w-full justify-center bg-[#059669] hover:bg-[#047857] text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all border-0"
                >
                  Product Enquiry
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function SheetNavLink({
  to,
  onClick,
  isSubItem = false,
  children,
}: {
  to: string
  onClick?: () => void
  isSubItem?: boolean
  children: ReactNode
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-xl transition-all duration-200 flex items-center justify-between ${
          isSubItem ? "px-3 py-2 text-xs" : "px-3.5 py-2.5 text-sm"
        } ${
          isActive
            ? "bg-[#059669] text-white font-semibold shadow-md shadow-emerald-900/40"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  )
}
