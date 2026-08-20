import { getImage } from "@/assets/images"

interface PageBannerProps {
  image: string
  title: string
  subtitle?: string
}

export function PageBanner({ image, title, subtitle }: PageBannerProps) {
  return (
    <div
      className="relative flex h-40 items-center justify-center bg-cover bg-center sm:h-56"
      style={{ backgroundImage: `url(${getImage(image)})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative text-center text-white">
        <h1 className="text-2xl font-semibold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/80 sm:text-base">{subtitle}</p>}
      </div>
    </div>
  )
}
