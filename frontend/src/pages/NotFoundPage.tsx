import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PageMeta } from "@/components/PageMeta"

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button render={<Link to="/" />}>Back to Home</Button>
      </div>
    </>
  )
}
