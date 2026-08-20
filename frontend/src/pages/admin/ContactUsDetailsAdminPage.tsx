import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Inbox,
  User,
  Mail,
  Phone,
  Tag,
  FileText,
  Calendar,
  Copy,
  Paperclip,
  Send,
  Loader2,
} from "lucide-react"
import { useEnquiries, type Enquiry } from "@/lib/queries"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"

export function ContactUsDetailsAdminPage() {
  const [status, setStatus] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [viewing, setViewing] = useState<Enquiry | null>(null)

  // State for email reply modal
  const [replyingTo, setReplyingTo] = useState<Enquiry | null>(null)
  const [replySubject, setReplySubject] = useState<string>("")
  const [replyMessage, setReplyMessage] = useState<string>("")

  // Fetch enquiries with type='contact' by default (or all contact form entries)
  const { data: rawEnquiries, isLoading } = useEnquiries({ type: "contact", status, search })
  const queryClient = useQueryClient()

  // Filter client-side if needed
  const enquiries = rawEnquiries ?? []

  const totalCount = enquiries.length
  const newCount = enquiries.filter((e) => e.status === "new").length
  const contactedCount = enquiries.filter((e) => e.status === "contacted").length
  const closedCount = enquiries.filter((e) => e.status === "closed").length

  const handleOpenReply = (e: Enquiry) => {
    setReplyingTo(e)
    setReplySubject(`Re: ${e.category ? `Inquiry regarding ${e.category}` : "Contact Us Enquiry"} - Vrushahi Impex`)
    setReplyMessage(
      `Dear ${e.name},\n\nThank you for contacting Vrushahi Impex.\n\n\n\nBest regards,\nCustomer Support & Trade Desk\nVrushahi Impex`
    )
  }

  const sendReplyMutation = useMutation({
    mutationFn: ({ id, subject, message }: { id: string; subject: string; message: string }) =>
      api.post(`/enquiries/${id}/reply`, { subject, message }),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] })
      toast.success(res?.message || "Reply email sent successfully!")
      setReplyingTo(null)
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to send email. Please check server email settings.")
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/enquiries/${id}/status`, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] })
      toast.success(`Status updated to ${variables.status}`)
      if (viewing && viewing._id === variables.id) {
        setViewing((prev) => (prev ? { ...prev, status: variables.status as Enquiry["status"] } : null))
      }
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update status"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/enquiries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] })
      toast.success("Contact submission deleted")
      if (viewing) setViewing(null)
      if (replyingTo) setReplyingTo(null)
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  })

  function formatCategory(cat?: string) {
    if (!cat || cat === "General Requirement" || cat === "General Export Requirement" || cat === "General Export") {
      return "General Export Bulk Requirement"
    }
    return cat
  }

  function exportPdf() {
    if (!enquiries.length) {
      toast.error("No data available to export")
      return
    }

    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

      // Header Branding
      doc.setFontSize(16)
      doc.setTextColor(5, 150, 105) // Emerald 600
      doc.text("VRUSHAHI IMPEX - CONTACT SUBMISSIONS REPORT", 14, 15)

      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated on: ${new Date().toLocaleString()} | Total Entries: ${enquiries.length}`, 14, 22)

      const tableHeaders = [
        ["#", "Date & Time", "Full Name", "Email Address", "Phone / WhatsApp", "Category Interest", "Status"]
      ]

      const tableRows = enquiries.map((e, index) => [
        index + 1,
        new Date(e.createdAt).toLocaleString(),
        e.name,
        e.email,
        e.phone,
        formatCategory(e.category),
        e.status.toUpperCase(),
      ])

      autoTable(doc, {
        head: tableHeaders,
        body: tableRows,
        startY: 27,
        theme: "grid",
        headStyles: {
          fillColor: [5, 150, 105],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { top: 27, left: 14, right: 14, bottom: 15 },
      })

      doc.save(`Contact_Submissions_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
      toast.success("Exported Contact Submissions report to PDF")
    } catch (err) {
      toast.error("Failed to generate PDF export")
    }
  }

  async function handleDownloadFile(url: string, filename: string) {
    const fullUrl = url.startsWith("http")
      ? url
      : `${(import.meta.env.VITE_API_URL || "").replace(/\/api$/, "")}${url}`

    try {
      toast.info(`Starting download: ${filename}...`)
      const res = await fetch(fullUrl)
      if (!res.ok) throw new Error("Network error")
      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename || "document.pdf"
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
      toast.success(`Downloaded ${filename}`)
    } catch (error) {
      const link = document.createElement("a")
      link.href = fullUrl
      link.download = filename || "document.pdf"
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "new":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">New</span>
      case "contacted":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">Contacted</span>
      case "closed":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">Closed</span>
      default:
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border border-border">{s}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Metrics Summary Cards & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-1.5 shadow-2xs">
            <div className="size-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Inbox className="size-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">Total Contact Submissions:</span>
              <span className="text-xs font-bold text-foreground">{totalCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-1.5 shadow-2xs">
            <div className="size-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Clock className="size-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">New:</span>
              <span className="text-xs font-bold text-emerald-400">{newCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-1.5 shadow-2xs">
            <div className="size-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Filter className="size-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">In Contact:</span>
              <span className="text-xs font-bold text-amber-400">{contactedCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-1.5 shadow-2xs">
            <div className="size-6 rounded-md bg-zinc-500/10 flex items-center justify-center text-zinc-400">
              <CheckCircle2 className="size-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">Closed:</span>
              <span className="text-xs font-bold text-zinc-400">{closedCount}</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={exportPdf}
          className="h-8 rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 font-semibold text-xs gap-1.5 px-3 shadow-2xs shrink-0 cursor-pointer"
        >
          <FileText className="size-3.5" /> Export PDF
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/60 p-3 rounded-2xl border border-border/60 backdrop-blur-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, query..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-background/80 border-border/80 text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
            Status:
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-xl border border-border/80 bg-background/80 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Date & Time</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Name</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Email / Phone</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Category Interest</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.length ? (
                enquiries.map((e) => (
                  <TableRow
                    key={e._id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setViewing(e)}
                  >
                    <TableCell className="text-xs whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground">
                          {new Date(e.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(e.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="font-semibold text-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          {e.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{e.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground font-medium">{e.email}</span>
                        <span className="text-muted-foreground">{e.phone}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-emerald-400">
                      {formatCategory(e.category)}
                    </TableCell>

                    <TableCell onClick={(ev) => ev.stopPropagation()}>
                      <select
                        value={e.status}
                        onChange={(ev) => statusMutation.mutate({ id: e._id, status: ev.target.value })}
                        className="h-8 rounded-lg border border-border/80 bg-background/90 px-2 text-xs font-medium capitalize cursor-pointer focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </TableCell>

                    <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewing(e)}
                          className="size-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400"
                          title="View Full Details"
                        >
                          <Eye className="size-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenReply(e)}
                          className="size-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-emerald-400"
                          title="Reply via Email"
                        >
                          <Mail className="size-4" />
                        </Button>

                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          }
                          title="Delete Submission?"
                          description="This submission will be permanently deleted."
                          onConfirm={() => deleteMutation.mutate(e._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="animate-spin size-4 border-2 border-emerald-500 border-t-transparent rounded-full" />
                        Loading Contact Submissions...
                      </div>
                    ) : (
                      "No contact submissions found."
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Modal Dialog */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-xl rounded-2xl border-border/80 bg-background p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader className="border-b border-border/60 pb-3">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <User className="size-5 text-emerald-500" />
                    {viewing.name}
                  </DialogTitle>
                  {getStatusBadge(viewing.status)}
                </div>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  Submitted on {new Date(viewing.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 py-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-3 rounded-xl border border-border/50 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Mail className="size-4 text-emerald-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</p>
                        <a href={`mailto:${viewing.email}`} className="text-xs sm:text-[13px] font-semibold text-foreground hover:underline whitespace-nowrap block truncate" title={viewing.email}>
                          {viewing.email}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(viewing.email)
                        toast.success("Email copied to clipboard!")
                      }}
                      className="inline-flex items-center justify-center size-7 rounded-lg border border-border/60 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                      title="Copy Email Address"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-xl border border-border/50 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Phone className="size-4 text-emerald-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone / WhatsApp</p>
                        <a href={`tel:${viewing.phone}`} className="text-xs sm:text-[13px] font-semibold text-foreground hover:underline whitespace-nowrap block truncate" title={viewing.phone}>
                          {viewing.phone}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(viewing.phone)
                        toast.success("Phone number copied!")
                      }}
                      className="inline-flex items-center justify-center size-7 rounded-lg border border-border/60 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                      title="Copy Phone Number"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-xl border border-border/50 flex items-start gap-2.5">
                  <Tag className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Product Category Interest</p>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-0.5">
                      {formatCategory(viewing.category)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileText className="size-4 text-emerald-500" />
                    Requirement Details / Specs
                  </p>
                  <div className="bg-muted/40 p-3.5 rounded-xl border border-border/60 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {viewing.message}
                  </div>
                </div>

                {/* Attachments Section */}
                {viewing.attachments && viewing.attachments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Paperclip className="size-4 text-emerald-500" />
                      Attached Documents ({viewing.attachments.length})
                    </p>
                    <div className="space-y-2">
                      {viewing.attachments.map((a, i) => {
                        const ext = a.filename.split(".").pop()?.toUpperCase() || "FILE"
                        const isPdf = ext === "PDF"

                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${isPdf ? "bg-red-500/15 text-red-400 border border-red-500/30" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"}`}>
                                {isPdf ? <FileText className="size-4" /> : <Paperclip className="size-4" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-foreground break-all" title={a.filename}>
                                  {a.filename}
                                </p>
                              </div>
                            </div>

                            <Button
                              type="button"
                              onClick={() => handleDownloadFile(a.url, a.filename)}
                              size="sm"
                              className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shadow-2xs transition-colors shrink-0"
                              title="Download document"
                            >
                              <Download className="size-3.5" />
                              <span>Download</span>
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">Change Status:</span>
                    <select
                      value={viewing.status}
                      onChange={(ev) => statusMutation.mutate({ id: viewing._id, status: ev.target.value })}
                      className="h-8 rounded-lg border border-border/80 bg-background px-2 text-xs font-medium capitalize cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        const target = viewing
                        setViewing(null)
                        handleOpenReply(target)
                      }}
                      className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 px-3 shadow-2xs"
                    >
                      <Mail className="size-3.5" /> Reply via Mail
                    </Button>

                    <ConfirmDialog
                      trigger={
                        <Button variant="destructive" size="sm" className="h-8 rounded-lg text-xs gap-1.5 px-3">
                          <Trash2 className="size-3.5" /> Delete Entry
                        </Button>
                      }
                      title="Delete this submission?"
                      description="This cannot be undone."
                      onConfirm={() => deleteMutation.mutate(viewing._id)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply via Email Modal Dialog */}
      <Dialog open={!!replyingTo} onOpenChange={(open) => !open && setReplyingTo(null)}>
        <DialogContent className="sm:max-w-xl rounded-2xl border-border/80 bg-background p-5 sm:p-6 shadow-2xl">
          {replyingTo && (
            <>
              <DialogHeader className="border-b border-border/60 pb-3">
                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Mail className="size-5 text-emerald-500" />
                  Send Email Reply
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  Direct reply to <strong className="text-foreground">{replyingTo.name}</strong> ({replyingTo.email})
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(ev) => {
                  ev.preventDefault()
                  if (!replySubject.trim() || !replyMessage.trim()) return
                  sendReplyMutation.mutate({
                    id: replyingTo._id,
                    subject: replySubject,
                    message: replyMessage,
                  })
                }}
                className="space-y-4 py-3"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recipient Email</label>
                  <Input value={`${replyingTo.name} <${replyingTo.email}>`} disabled className="bg-muted/40 text-xs font-medium" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject *</label>
                  <Input
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Enter email subject line..."
                    className="text-xs sm:text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reply Message Body *</label>
                  <textarea
                    rows={7}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your response message..."
                    className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs sm:text-sm font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    required
                  />
                </div>

                {replyingTo.message && (
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Original Enquiry Message:</span>
                    <p className="mt-1 line-clamp-2 italic">"{replyingTo.message}"</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setReplyingTo(null)}
                    className="h-9 rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={sendReplyMutation.isPending || !replySubject.trim() || !replyMessage.trim()}
                    className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-2 px-4 shadow-sm"
                  >
                    {sendReplyMutation.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Sending Email...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" /> Send Email
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
