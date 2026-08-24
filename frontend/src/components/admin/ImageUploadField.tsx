import { useRef, useState, useEffect, type ChangeEvent } from "react"
import { ImagePlus, Loader2, X, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { compressImage, formatBytes } from "@/lib/imageCompressor"

interface ImageUploadFieldProps {
  label: string
  currentUrl?: string
  onChange: (file: File | null) => void
}

export function ImageUploadField({ label, currentUrl, onChange }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // If currentUrl changes or resets, reset preview
    if (!currentUrl) {
      setPreview(null)
      setCompressionInfo(null)
    }
  }, [currentUrl])

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const originalFile = e.target.files?.[0] ?? null
    if (!originalFile) return

    // Immediately display preview from local file for instant UX
    const localPreviewUrl = URL.createObjectURL(originalFile)
    setPreview(localPreviewUrl)
    setIsCompressing(true)
    setCompressionInfo(null)
    onChange(originalFile)

    try {
      // Auto compress in background (takes <100ms)
      const compressed = await compressImage(originalFile, {
        maxWidth: 1400,
        maxHeight: 1400,
        quality: 0.85,
      })

      if (compressed.size < originalFile.size) {
        setCompressionInfo(
          `${formatBytes(originalFile.size)} → ${formatBytes(compressed.size)}`
        )
      } else {
        setCompressionInfo(`${formatBytes(compressed.size)}`)
      }

      onChange(compressed)
    } catch {
      // Safe fallback
      onChange(originalFile)
    } finally {
      setIsCompressing(false)
    }
  }

  function handleRemove() {
    setPreview(null)
    setCompressionInfo(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const shown = preview ?? currentUrl

  return (
    <div className="space-y-1.5">
      {label && <Label className="text-xs font-semibold">{label}</Label>}
      <div className="flex items-center gap-3">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/60 shadow-xs">
          {shown ? (
            <img
              src={shown}
              alt=""
              className="size-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // If transformed preview fails, show fallback
                if (currentUrl && (e.currentTarget as HTMLImageElement).src !== currentUrl) {
                  ;(e.currentTarget as HTMLImageElement).src = currentUrl
                }
              }}
            />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}

          {isCompressing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-xs">
              <Loader2 className="size-4 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={handleFile}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              {shown ? "Change image" : "Upload image"}
            </Button>

            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                onClick={handleRemove}
                title="Remove selected image"
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>

          {compressionInfo && (
            <p className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="size-3" /> Optimized ({compressionInfo})
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
