import { Link } from "react-router-dom"
import { useCategories, useFooterSettings, useSiteSettings } from "@/lib/queries"
import { getImage } from "@/assets/images"
import { cloudinaryUrl } from "@/lib/cloudinaryUrl"

export function Footer() {
  const { data: categories } = useCategories()
  const { data: footerData } = useFooterSettings()
  const { data: settings } = useSiteSettings()
  const productCategories = categories ?? []

  const brandDescription = footerData?.brandDescription || ""

  const facebookUrl = footerData?.facebookUrl || "#"
  const showFacebook = footerData?.showFacebook !== undefined ? footerData.showFacebook : true
  const instagramUrl = footerData?.instagramUrl || "#"
  const showInstagram = footerData?.showInstagram !== undefined ? footerData.showInstagram : true
  const linkedinUrl = footerData?.linkedinUrl || "#"
  const showLinkedin = footerData?.showLinkedin !== undefined ? footerData.showLinkedin : true
  const youtubeUrl = footerData?.youtubeUrl || "#"
  const showYoutube = footerData?.showYoutube !== undefined ? footerData.showYoutube : true

  const contactPhone = footerData?.contactPhone || ""
  const contactPhoneHref = contactPhone ? `tel:${contactPhone.replace(/\s+/g, "")}` : ""
  const contactEmail = footerData?.contactEmail || ""
  const contactAddress = footerData?.contactAddress || ""

  const copyrightText =
    footerData?.copyrightText || `© ${new Date().getFullYear()} Vrushahi Impex. All rights reserved.`

  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#0a1128] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <img
              src={cloudinaryUrl(settings?.companyInfo?.logo?.url, 300) || getImage("vrushahilogo.png")}
              alt="Vrushahi Impex Logo"
              width="200"
              height="96"
              loading="lazy"
              decoding="async"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)]"
            />
            {brandDescription && (
              <p className="text-xs leading-relaxed text-slate-400">
                {brandDescription}
              </p>
            )}
            <div className="flex items-center gap-2.5 pt-2">
              {showFacebook && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-white hover:bg-white hover:text-[#0a1128]"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {showInstagram && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-white hover:bg-white hover:text-[#0a1128]"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {showLinkedin && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-white hover:bg-white hover:text-[#0a1128]"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {showYoutube && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:border-white hover:bg-white hover:text-[#0a1128]"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Group 2 & 3: PRODUCTS and COMPANY side-by-side on mobile view */}
          <div className="grid grid-cols-2 gap-6 sm:contents">
            {/* Column 2: PRODUCTS */}
            {productCategories.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                  PRODUCTS
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
                  {productCategories.slice(0, 6).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        to={`/products/${cat.slug}`}
                        className="transition-colors hover:text-white"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 3: COMPANY (Static links) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                COMPANY
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link to="/about-us" className="transition-colors hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="transition-colors hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/enquiry" className="transition-colors hover:text-white">
                    Product Enquiry
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us" className="transition-colors hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: CONTACT (Dynamic) */}
          {(contactPhone || contactEmail || contactAddress) && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                CONTACT
              </h3>
              <div className="mt-4 space-y-2.5 text-xs text-slate-400">
                {contactPhone && (
                  <p>
                    <a
                      href={contactPhoneHref}
                      className="transition-colors hover:text-white"
                    >
                      {contactPhone}
                    </a>
                  </p>
                )}
                {contactEmail && (
                  <p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="transition-colors hover:text-white break-all"
                    >
                      {contactEmail}
                    </a>
                  </p>
                )}
                {contactAddress && (
                  <div className="pt-1 leading-relaxed text-slate-400">
                    <p>{contactAddress}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-5 sm:flex-row text-xs text-slate-400">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="transition-colors hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
