import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface ImageRef {
  url: string
  public_id: string
}

export interface ShowcaseImage {
  name?: string
  url: string
  public_id?: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  bannerImage?: ImageRef
  intro?: string
  feature1Title?: string
  feature1Subtitle?: string
  feature2Title?: string
  feature2Subtitle?: string
  showcaseImages?: ShowcaseImage[]
  productCount?: number
}

export interface Product {
  _id: string
  name: string
  category: string | { _id: string; name: string; slug: string } | null
  image?: ImageRef
  description?: string
  featured: boolean
  isHighlight?: boolean
}

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: ImageRef
  date: string
  category: string
  readTime: string
  author: string
}

export interface HeroSubItem {
  name: string
  description: string
  image?: ImageRef
}

export interface HeroItem {
  _id: string
  slug: string
  name: string
  eyebrow: string
  titleLine1: string
  titleLine2: string
  blurb: string
  image?: ImageRef
  tint: string
  badge: string
  rating: string
  reviewsCount: string
  prepTime: string
  calories: string
  spiceLevel: string
  description: string
  ingredients: string[]
  videoUrl?: string
  price: string
  order: number
  items: HeroSubItem[]
}

export interface Enquiry {
  _id: string
  type: "contact" | "enquiry"
  name: string
  email: string
  phone: string
  category?: string
  website?: string
  address?: string
  message: string
  attachments: { url: string; filename: string }[]
  status: "new" | "contacted" | "closed"
  createdAt: string
}

export interface SiteSettings {
  _id: string
  companyInfo: {
    name: string
    tagline: string
    phone: string
    phoneHref: string
    emails: string[]
    addressLines: string[]
    mapEmbedSrc: string
    logo?: ImageRef
  }
  socialLinks: { facebook: string; instagram: string; linkedin: string }
}

export interface MonthlyTimelineItem {
  month: string
  "Product Enquiry": number
  "Contact Us": number
}

export interface Stats {
  totalCategoryProducts?: number
  totalProducts: number
  totalCategories: number
  totalPosts: number
  newEnquiries: number
  newContactUs?: number
  contactedContactUs?: number
  closedContactUs?: number
  newProductEnquiry?: number
  contactedProductEnquiry?: number
  closedProductEnquiry?: number
  recentEnquiries: Enquiry[]
  monthlyTimeline?: MonthlyTimelineItem[]
}

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await api.get<Category[]>("/categories")
      if (data && data.length > 0) {
        try {
          localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: () => getInitialCacheData<Category[]>(CATEGORIES_CACHE_KEY),
    staleTime: 15 * 60 * 1000,
  })

export const useCategory = (slug: string | undefined) =>
  useQuery({
    queryKey: ["category", slug],
    queryFn: () => api.get<Category & { products: Product[] }>(`/categories/${slug}`),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  })

export const useProducts = (params?: { category?: string; featured?: boolean }) => {
  const search = new URLSearchParams()
  if (params?.category) search.set("category", params.category)
  if (params?.featured) search.set("featured", "true")
  const qs = search.toString()
  const cacheKey = !qs ? PRODUCTS_CACHE_KEY : params?.featured ? FEATURED_PRODUCTS_CACHE_KEY : undefined

  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const data = await api.get<Product[]>(`/products${qs ? `?${qs}` : ""}`)
      if (data && data.length > 0 && cacheKey) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: cacheKey ? () => getInitialCacheData<Product[]>(cacheKey) : undefined,
    staleTime: 15 * 60 * 1000,
  })
}

export const useCategoryProducts = (params?: { category?: string; highlight?: boolean }) => {
  const search = new URLSearchParams()
  if (params?.category) search.set("category", params.category)
  if (params?.highlight) search.set("highlight", "true")
  const qs = search.toString()
  const cacheKey = params?.highlight ? HIGHLIGHT_PRODUCTS_CACHE_KEY : undefined

  return useQuery({
    queryKey: ["category-products", params],
    queryFn: async () => {
      const data = await api.get<Product[]>(`/category-products${qs ? `?${qs}` : ""}`)
      if (data && data.length > 0 && cacheKey) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: cacheKey ? () => getInitialCacheData<Product[]>(cacheKey) : undefined,
    staleTime: 15 * 60 * 1000,
  })
}

export const useBlogPosts = () =>
  useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const data = await api.get<BlogPost[]>("/blog")
      if (data && data.length > 0) {
        try {
          localStorage.setItem(BLOG_POSTS_CACHE_KEY, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: () => getInitialCacheData<BlogPost[]>(BLOG_POSTS_CACHE_KEY),
    staleTime: 15 * 60 * 1000,
  })

export const useBlogPost = (slug: string | undefined) =>
  useQuery({
    queryKey: ["blogPost", slug],
    queryFn: () => api.get<BlogPost>(`/blog/${slug}`),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  })

export interface HeroVideo {
  _id: string
  title: string
  videoUrl: string
  public_id?: string
  isActive: boolean
}

export interface AboutCompanyImage {
  url: string
  public_id?: string
  alt?: string
}

export interface AboutCompany {
  _id: string
  badge: string
  title: string
  highlightWord: string
  leadText: string
  bodyText: string
  buttonText: string
  buttonLink: string
  images: AboutCompanyImage[]
}

export const useAboutCompany = () =>
  useQuery({
    queryKey: ["aboutCompany"],
    queryFn: async () => {
      const data = await api.get<AboutCompany>("/about")
      if (data) {
        try {
          localStorage.setItem(ABOUT_COMPANY_CACHE_KEY, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: () => getInitialCacheData<AboutCompany>(ABOUT_COMPANY_CACHE_KEY),
    staleTime: 15 * 60 * 1000,
  })

export interface CoreValueItem {
  _id?: string
  icon: string
  title: string
  description: string
}

export interface AboutUsPageData {
  _id: string
  storyBadge: string
  storyTitleLine1: string
  storyTitleHighlight: string
  storyParagraph1: string
  storyParagraph2: string
  certifications: string[]
  heroImage?: ImageRef
  heroImageCaptionTitle: string
  heroImageCaptionSub: string
  ctaButtonText: string
  ctaButtonLink: string

  standardsBadge: string
  standardsTitle: string
  standardsDescription: string
  coreValues: CoreValueItem[]

  missionTitle: string
  missionDescription: string
  visionTitle: string
  visionDescription: string
}

export interface FaqItem {
  _id?: string
  question: string
  answer: string
}

export interface EnquiryFeatureItem {
  _id?: string
  icon: string
  title: string
  description: string
}

export interface ContactUsPageData {
  heroBadge: string
  heroTitle: string
  heroSubtitle: string

  headquartersBadge: string
  headquartersTitle: string
  headquartersAddress: string
  headquartersMapUrl: string

  phoneBadge: string
  phoneTitle: string
  phoneNumber: string
  phoneHours: string
  phoneCallHref: string
  whatsappNumber: string

  emailBadge: string
  emailTitle: string
  primaryEmail: string
  secondaryEmail: string

  formBadge: string
  formTitle: string
  formSubtitle: string

  enquirySupportTitle?: string
  enquirySupportSubtitle?: string
  enquirySupportFeatures?: EnquiryFeatureItem[]
  enquiryTradeDeskTitle?: string
  enquiryTradeDeskPhone?: string
  enquiryTradeDeskEmail?: string
  enquiryTradeDeskLocation?: string

  faqBadge: string
  faqTitle: string
  faqSubtitle: string
  faqs: FaqItem[]
}

export interface FooterSettingsData {
  brandDescription: string
  facebookUrl: string
  showFacebook?: boolean
  instagramUrl: string
  showInstagram?: boolean
  linkedinUrl: string
  showLinkedin?: boolean
  youtubeUrl: string
  showYoutube?: boolean

  contactPhone: string
  contactPhoneHref: string
  contactEmail: string
  contactAddress: string

  copyrightText: string
  privacyText: string
  privacyUrl: string
  termsText: string
  termsUrl: string
}

export const useAboutUsPage = () =>
  useQuery({
    queryKey: ["aboutUsPage"],
    queryFn: async () => {
      const data = await api.get<AboutUsPageData>("/about-us-page")
      if (data) {
        try {
          localStorage.setItem(ABOUT_US_PAGE_CACHE_KEY, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: () => getInitialCacheData<AboutUsPageData>(ABOUT_US_PAGE_CACHE_KEY),
    staleTime: 15 * 60 * 1000,
  })

export const useContactUsPage = () =>
  useQuery({
    queryKey: ["contactUsPage"],
    queryFn: async () => {
      const data = await api.get<ContactUsPageData>("/contact-us-page")
      if (data) {
        try {
          localStorage.setItem(CONTACT_US_PAGE_CACHE_KEY, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: () => getInitialCacheData<ContactUsPageData>(CONTACT_US_PAGE_CACHE_KEY),
    staleTime: 15 * 60 * 1000,
  })

export const useFooterSettings = () =>
  useQuery({ queryKey: ["footerSettings"], queryFn: () => api.get<FooterSettingsData>("/footer-settings") })

export interface LegalSectionItem {
  _id?: string
  heading: string
  body: string
}

export interface LegalPageData {
  _id: string
  slug: "terms-and-conditions" | "privacy-policy"
  badge: string
  title: string
  subtitle: string
  lastUpdated: string
  seoDescription: string
  sections: LegalSectionItem[]
}

export const useLegalPage = (slug: string | undefined) =>
  useQuery({
    queryKey: ["legalPage", slug],
    queryFn: () => api.get<LegalPageData>(`/legal/${slug}`),
    enabled: !!slug,
  })

const HERO_ITEMS_CACHE_KEY = "vrushahi_hero_items_cache"
const HERO_VIDEOS_CACHE_KEY = "vrushahi_hero_videos_cache"
const SITE_SETTINGS_CACHE_KEY = "vrushahi_site_settings_cache"
const BLOG_POSTS_CACHE_KEY = "vrushahi_blog_posts_cache"
const CATEGORIES_CACHE_KEY = "vrushahi_categories_cache"
const PRODUCTS_CACHE_KEY = "vrushahi_products_cache"
const FEATURED_PRODUCTS_CACHE_KEY = "vrushahi_featured_products_cache"
const HIGHLIGHT_PRODUCTS_CACHE_KEY = "vrushahi_highlight_products_cache"
const ABOUT_COMPANY_CACHE_KEY = "vrushahi_about_company_cache"
const ABOUT_US_PAGE_CACHE_KEY = "vrushahi_about_us_page_cache"
const CONTACT_US_PAGE_CACHE_KEY = "vrushahi_contact_us_page_cache"

function getInitialCacheData<T>(key: string): T | undefined {
  try {
    const cached = localStorage.getItem(key)
    if (cached) return JSON.parse(cached)
  } catch {
    // Ignore storage quota or SSR errors
  }
  return undefined
}

export const useHeroItems = () =>
  useQuery({
    queryKey: ["heroItems"],
    queryFn: async () => {
      const data = await api.get<HeroItem[]>("/hero")
      if (data && data.length > 0) {
        try {
          localStorage.setItem(HERO_ITEMS_CACHE_KEY, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: () => getInitialCacheData<HeroItem[]>(HERO_ITEMS_CACHE_KEY),
    staleTime: 15 * 60 * 1000,
  })

export const useHeroVideos = () =>
  useQuery({
    queryKey: ["heroVideos"],
    queryFn: async () => {
      const data = await api.get<HeroVideo[]>("/hero/videos")
      if (data && data.length > 0) {
        try {
          localStorage.setItem(HERO_VIDEOS_CACHE_KEY, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: () => getInitialCacheData<HeroVideo[]>(HERO_VIDEOS_CACHE_KEY),
    staleTime: 15 * 60 * 1000,
  })

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const data = await api.get<SiteSettings>("/settings")
      if (data) {
        try {
          localStorage.setItem(SITE_SETTINGS_CACHE_KEY, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    placeholderData: () => getInitialCacheData<SiteSettings>(SITE_SETTINGS_CACHE_KEY),
    staleTime: 15 * 60 * 1000,
  })

export const useStats = (year?: number) =>
  useQuery({
    queryKey: ["stats", year],
    queryFn: () => api.get<Stats>(year ? `/admin/stats?year=${year}` : "/admin/stats"),
  })

export const useEnquiries = (params?: { type?: string; status?: string; search?: string }) => {
  const search = new URLSearchParams()
  if (params?.type) search.set("type", params.type)
  if (params?.status) search.set("status", params.status)
  if (params?.search) search.set("search", params.search)
  const qs = search.toString()
  return useQuery({
    queryKey: ["enquiries", params],
    queryFn: () => api.get<Enquiry[]>(`/enquiries${qs ? `?${qs}` : ""}`),
  })
}
