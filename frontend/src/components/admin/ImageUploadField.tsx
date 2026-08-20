import { useRef, useState, type ChangeEvent } from "react"
import { ImagePlus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ImageUploadFieldProps {
  label: string
  currentUrl?: string
  onChange: (file: File | null) => void
}

export function ImageUploadField({ label, currentUrl, onChange }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    onChange(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const shown = preview ?? currentUrl

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {shown ? (
            <img src={shown} alt="" className="size-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          {shown ? "Change image" : "Upload image"}
        </Button>
      </div>
    </div>
  )
}
