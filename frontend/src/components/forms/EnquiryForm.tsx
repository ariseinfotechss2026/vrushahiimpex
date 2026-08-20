import { useState, type FormEvent, type ChangeEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Package,
  MessageSquare,
  Paperclip,
  FileText,
  Send,
  CheckCircle2,
  Upload,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

export function EnquiryForm() {
  const { data: categories } = useCategories()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refId, setRefId] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [address, setAddress] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")

  const [letterName, setLetterName] = useState<string | null>(null)
  const [orderName, setOrderName] = useState<string | null>(null)
  const [letterFile, setLetterFile] = useState<File | null>(null)
  const [orderFile, setOrderFile] = useState<File | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter your Name")
      return
    }
    if (!email.trim()) {
      toast.error("Please enter your Email address")
      return
    }
    if (!phone.trim()) {
      toast.error("Please enter your Phone number")
      return
    }
    if (!message.trim()) {
      toast.error("Please enter your Message or product requirements")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("type", "enquiry")
    formData.append("name", name.trim())
    formData.append("email", email.trim())
    formData.append("phone", phone.trim())
    formData.append("website", website.trim())
    formData.append("address", address.trim())
    formData.append("category", category.trim())
    formData.append("message", message.trim())

    if (letterFile) formData.append("attachments", letterFile)
    if (orderFile) formData.append("attachments", orderFile)

    try {
      const enquiry = await api.post<{ _id: string }>("/enquiries", formData)
      setRefId(`EXP-${enquiry._id.slice(-6).toUpperCase()}`)
      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to send. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleLetterChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setLetterFile(e.target.files[0])
      setLetterName(e.target.files[0].name)
    } else {
      setLetterFile(null)
      setLetterName(null)
    }
  }

  function handleOrderChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setOrderFile(e.target.files[0])
      setOrderName(e.target.files[0].name)
    } else {
      setOrderFile(null)
      setOrderName(null)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#059669]/30 bg-gradient-to-b from-[#059669]/10 to-transparent p-8 sm:p-12 text-center shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#059669] text-white shadow-lg shadow-[#059669]/30">
          <CheckCircle2 className="size-10" />
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#059669]/15 px-3 py-1 text-xs font-bold text-[#059669] uppercase tracking-wider">
          <ShieldCheck className="size-3.5" /> Product Enquiry Received
        </span>
        <h3 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl text-center text-balance">
          Thank You for Your Product Enquiry!
        </h3>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-lg mx-auto leading-relaxed text-center text-balance">
          Our trade manager in Sangli, India will review your specifications and contact you shortly with quotation & COA details.
        </p>

        <div className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-mono text-muted-foreground shadow-inner mx-auto">
          <span>Reference ID:</span>
          <span className="font-bold text-[#059669]">{refId}</span>
        </div>

        <div className="mt-8 pt-6 w-full border-t border-border/60 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              setName("")
              setEmail("")
              setPhone("")
              setWebsite("")
              setAddress("")
              setCategory("")
              setMessage("")
              setLetterName(null)
              setOrderName(null)
              setLetterFile(null)
              setOrderFile(null)
            }}
            className="gap-2 border-[#059669]/40 hover:bg-[#059669]/10 hover:text-[#059669]"
          >
            <RefreshCw className="size-4" /> Submit Another Product Enquiry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      {/* 2-Col Grid: Name & Email */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
            <User className="size-3 text-[#059669]" /> Name <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="h-8 rounded-md bg-background border-border px-2.5 text-xs transition-all focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
            <Mail className="size-3 text-[#059669]" /> Email <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-8 rounded-md bg-background border-border px-2.5 text-xs transition-all focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
          />
        </div>
      </div>

      {/* 2-Col Grid: Phone & Website */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
            <Phone className="size-3 text-[#059669]" /> Phone <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="h-8 rounded-md bg-background border-border px-2.5 text-xs transition-all focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Label htmlFor="website" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
            <Globe className="size-3 text-muted-foreground" /> Website
          </Label>
          <Input
            id="website"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Enter your website URL"
            className="h-8 rounded-md bg-background border-border px-2.5 text-xs transition-all focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
          />
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
          <MapPin className="size-3 text-[#059669]" /> Address / Destination Port
        </Label>
        <Textarea
          id="address"
          name="address"
          rows={1}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address or target port of discharge (FOB/CIF)"
          className="rounded-md bg-background border-border p-2 text-xs transition-all focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 resize-none min-h-[38px] leading-tight"
        />
      </div>

      {/* Interested Product Category */}
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="product" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
          <Package className="size-3 text-[#059669]" /> Interested Product
        </Label>
        <select
          id="product"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs transition-all focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 focus:outline-none cursor-pointer"
        >
          <option value="">
            Select a product category (Optional)
          </option>
          {categories?.map((cat) => (
            <option key={cat.slug} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
          <MessageSquare className="size-3 text-[#059669]" /> Message / Requirements <span className="text-rose-500">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={2}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message or product specifications"
          className="rounded-md bg-background border-border p-2 text-xs transition-all focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 min-h-[52px] leading-tight"
        />
      </div>

      {/* File Uploads (Cover Letter & Order Document) */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {/* Cover Letter */}
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="letter" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Paperclip className="size-3 text-muted-foreground" /> Cover Letter
            </span>
            <span className="text-[9px] text-muted-foreground font-normal lowercase">(optional)</span>
          </Label>
          <div className="relative flex items-center">
            <label
              htmlFor="letter"
              className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-dashed border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground transition-all hover:border-[#059669] hover:bg-[#059669]/5"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Upload className="size-3 shrink-0 text-[#059669]" />
                <span className="truncate">{letterName ? letterName : "Attach doc/image (.pdf, .doc, .png...)"}</span>
              </div>
              {letterName && <CheckCircle2 className="size-3 shrink-0 text-[#059669]" />}
            </label>
            <input
              id="letter"
              type="file"
              accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,.webp,.xls,.xlsx,.csv,.txt"
              className="sr-only"
              onChange={handleLetterChange}
            />
          </div>
        </div>

        {/* Order Document */}
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="order" className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1">
              <FileText className="size-3 text-muted-foreground" /> Order Document
            </span>
            <span className="text-[9px] text-muted-foreground font-normal lowercase">(optional)</span>
          </Label>
          <div className="relative flex items-center">
            <label
              htmlFor="order"
              className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-dashed border-border bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground transition-all hover:border-[#059669] hover:bg-[#059669]/5"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Upload className="size-3 shrink-0 text-[#059669]" />
                <span className="truncate">{orderName ? orderName : "Attach specs/doc (.pdf, .doc, .png...)"}</span>
              </div>
              {orderName && <CheckCircle2 className="size-3 shrink-0 text-[#059669]" />}
            </label>
            <input
              id="order"
              type="file"
              accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,.webp,.xls,.xlsx,.csv,.txt"
              className="sr-only"
              onChange={handleOrderChange}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-0.5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="size-3 text-[#059669]" /> Strict confidentiality guaranteed.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-8 w-full sm:w-auto px-5 rounded-md bg-[#059669] text-white text-xs font-bold tracking-wide hover:bg-[#047857] shadow-sm transition-all duration-200"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Submitting...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              Submit Product Enquiry <Send className="size-3" />
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}

