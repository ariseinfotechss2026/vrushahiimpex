import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AdminSidebarNav } from "@/components/admin/AdminSidebar"
import { useAuth } from "@/context/AuthContext"
import { Toaster } from "@/components/ui/sonner"

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/contact-us-details": "Contact Us Details",
  "/admin/categories": "Category Management",
  "/admin/add-product": "Add Category Product",
  "/admin/products": "Highlight Service",
  "/admin/hero": "Homepage Banners",
  "/admin/blog": "Blog & News Articles",
  "/admin/enquiries": "Product Enquiry",
  "/admin/about-us": "About Us Page",
  "/admin/contact-us": "ContactUs Management",
  "/admin/footer": "Footer Management",
  "/admin/account": "Account & Security",
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { logout } = useAuth()
  const title = PAGE_TITLES[location.pathname] ?? "Admin Panel"

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-zinc-950 font-sans text-foreground">
      {/* Desktop Sidebar - Fixed locked */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950 md:block h-screen overflow-y-auto">
        <AdminSidebarNav />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 border-zinc-800 bg-zinc-950 text-zinc-100">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Menu</SheetTitle>
          </SheetHeader>
          <AdminSidebarNav onNavClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Body - Scrollable content area */}
      <div className="flex h-screen flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-background/95 px-4 py-3.5 backdrop-blur-md sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-border bg-card"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Vrushahi Admin
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-[11px] font-medium text-muted-foreground">Portal</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="gap-1.5 rounded-xl border-border text-xs font-semibold text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  )
}

