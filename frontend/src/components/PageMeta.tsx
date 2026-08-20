interface PageMetaProps {
  title: string
  description: string
}

export function PageMeta({ title, description }: PageMetaProps) {
  const fullTitle = `${title} | Vrushahi Impex`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
    </>
  )
}
