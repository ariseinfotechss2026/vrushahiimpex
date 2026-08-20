const modules = import.meta.glob<string>("./**/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
})

const images: Record<string, string> = {}
for (const [path, url] of Object.entries(modules)) {
  const cleanPath = path.replace("./", "")
  images[cleanPath] = url
  images[cleanPath.replace("images/", "").replace("ourproducts/", "")] = url
}

/** Single place every image path is resolved through, e.g. getImage("products/indianspices/Cardamom.jpg") */
export function getImage(path: string): string {
  return images[path] ?? images[path.replace("./", "")] ?? path
}
