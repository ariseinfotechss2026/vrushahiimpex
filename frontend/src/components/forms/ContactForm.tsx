import { useState, type FormEvent } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api, ApiError } from "@/lib/api"
import { useCategories } from "@/lib/queries"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: categories } = useCategories()
  const productCategories = categories ?? []

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      await api.post("/enquiries", {
        type: "contact",
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        category: formData.get("category"),
        message: formData.get("message"),
      })
      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to send. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center backdrop-blur-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-4">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground text-center text-balance">Inquiry Sent Successfully!</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed text-center text-balance">
          Thank you for reaching out to Vrushahi Impex. Our trade export team will review your requirement and get back to you within 24 hours.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="outline"
          className="mt-6 rounded-full px-6 text-xs font-semibold"
        >
          Send Another Inquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Full Name <span className="text-emerald-600">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
            className="h-11 rounded-xl border-border/80 bg-white text-foreground focus:border-emerald-600 focus:ring-emerald-600/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Email Address <span className="text-emerald-600">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            className="h-11 rounded-xl border-border/80 bg-white text-foreground focus:border-emerald-600 focus:ring-emerald-600/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Phone / WhatsApp <span className="text-emerald-600">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone / WhatsApp number"
            required
            className="h-11 rounded-xl border-border/80 bg-white text-foreground focus:border-emerald-600 focus:ring-emerald-600/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Product Category Interest
          </Label>
          <select
            id="category"
            name="category"
            className="h-11 w-full rounded-xl border border-border/80 bg-white px-3 text-sm text-foreground focus:border-emerald-600 focus:ring-emerald-600/20 focus:outline-none cursor-pointer"
          >
            <option value="">Select Category (Optional)</option>
            {productCategories.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="General Export Bulk Requirement">General Export Bulk Requirement</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
          Requirement Details / Specs <span className="text-emerald-600">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Enter requirement details (specify quantity, port destination, packaging preferences...)"
          required
          className="rounded-xl border-border/80 bg-white text-foreground focus:border-emerald-600 focus:ring-emerald-600/20 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full sm:w-auto rounded-full bg-[#059669] hover:bg-[#047857] text-white font-semibold px-8 py-6 shadow-lg shadow-emerald-500/20 gap-2.5 border-0 transition-all duration-300"
      >
        {isSubmitting ? "Sending Inquiry..." : "Submit Export Inquiry"}
        <Send className="size-4" />
      </Button>
    </form>
  )
}
