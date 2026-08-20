import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { ProtectedRoute } from "@/components/admin/ProtectedRoute"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { HomePage } from "@/pages/HomePage"

// Lazy-loaded pages to minimize initial JavaScript bundle size
const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage })))
const EnquiryPage = lazy(() => import("@/pages/EnquiryPage").then((m) => ({ default: m.EnquiryPage })))
const TermsPage = lazy(() => import("@/pages/legal/TermsPage").then((m) => ({ default: m.TermsPage })))
const PrivacyPolicyPage = lazy(() => import("@/pages/legal/PrivacyPolicyPage").then((m) => ({ default: m.PrivacyPolicyPage })))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })))
const ProductCategoryPage = lazy(() => import("@/pages/products/ProductCategoryPage").then((m) => ({ default: m.ProductCategoryPage })))
const BlogListPage = lazy(() => import("@/pages/blog/BlogListPage").then((m) => ({ default: m.BlogListPage })))
const BlogPostPage = lazy(() => import("@/pages/blog/BlogPostPage").then((m) => ({ default: m.BlogPostPage })))

// Lazy-loaded admin pages (keeps jspdf, tables, forms out of public site bundle)
const LoginPage = lazy(() => import("@/pages/admin/LoginPage").then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage").then((m) => ({ default: m.DashboardPage })))
const CategoriesPage = lazy(() => import("@/pages/admin/CategoriesPage").then((m) => ({ default: m.CategoriesPage })))
const AddProductPage = lazy(() => import("@/pages/admin/AddProductPage").then((m) => ({ default: m.AddProductPage })))
const ProductsPage = lazy(() => import("@/pages/admin/ProductsPage").then((m) => ({ default: m.ProductsPage })))
const HeroPage = lazy(() => import("@/pages/admin/HeroPage").then((m) => ({ default: m.HeroPage })))
const AdminBlogPage = lazy(() => import("@/pages/admin/BlogPage").then((m) => ({ default: m.BlogPage })))
const ContactUsDetailsAdminPage = lazy(() => import("@/pages/admin/ContactUsDetailsAdminPage").then((m) => ({ default: m.ContactUsDetailsAdminPage })))
const EnquiriesPage = lazy(() => import("@/pages/admin/EnquiriesPage").then((m) => ({ default: m.EnquiriesPage })))
const AboutUsAdminPage = lazy(() => import("@/pages/admin/AboutUsAdminPage").then((m) => ({ default: m.AboutUsAdminPage })))
const ContactUsAdminPage = lazy(() => import("@/pages/admin/ContactUsAdminPage").then((m) => ({ default: m.ContactUsAdminPage })))
const FooterAdminPage = lazy(() => import("@/pages/admin/FooterAdminPage").then((m) => ({ default: m.FooterAdminPage })))
const TermsAdminPage = lazy(() => import("@/pages/admin/TermsAdminPage").then((m) => ({ default: m.TermsAdminPage })))
const PrivacyAdminPage = lazy(() => import("@/pages/admin/PrivacyAdminPage").then((m) => ({ default: m.PrivacyAdminPage })))
const AccountPage = lazy(() => import("@/pages/admin/AccountPage").then((m) => ({ default: m.AccountPage })))

function PageLoader() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="contact-us" element={<ContactPage />} />
          <Route path="enquiry" element={<EnquiryPage />} />
          <Route path="terms-and-conditions" element={<TermsPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />

          <Route path="products/:slug" element={<ProductCategoryPage />} />

          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="contact-us-details" element={<ContactUsDetailsAdminPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="hero" element={<HeroPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path="about-us" element={<AboutUsAdminPage />} />
            <Route path="contact-us" element={<ContactUsAdminPage />} />
            <Route path="footer" element={<FooterAdminPage />} />
            <Route path="terms-and-conditions" element={<TermsAdminPage />} />
            <Route path="privacy-policy" element={<PrivacyAdminPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
