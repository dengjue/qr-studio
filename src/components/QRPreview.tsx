import { useEffect, useState, useRef, useCallback } from "react"
import { generateQRDataUrl } from "@/lib/qr-generator"
import type { QRStyleOptions } from "@/lib/qr-types"

interface Props {
  data: string
  style: QRStyleOptions
  className?: string
}

export function QRPreview({ data, style, className = "" }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const generate = useCallback(async () => {
    if (!data.trim()) {
      setDataUrl(null)
      return
    }
    setLoading(true)
    try {
      const url = await generateQRDataUrl(data, style, 512)
      setDataUrl(url)
    } catch {
      setDataUrl(null)
    } finally {
      setLoading(false)
    }
  }, [data, style])

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(generate, 200)
    return () => clearTimeout(timeoutRef.current)
  }, [generate])

  if (!data.trim()) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-input ${className}`}>
        <div className="text-center p-8">
          <div className="mx-auto mb-3 h-16 w-16 rounded-xl gradient-accent flex items-center justify-center">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="18" y="14" width="3" height="3" />
              <rect x="14" y="18" width="3" height="3" />
              <rect x="18" y="18" width="3" height="3" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">二维码预览</p>
          <p className="text-xs text-muted-foreground mt-1">输入内容后实时预览</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl qr-preview-container ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm">
          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
      {dataUrl && (
        <div className="flex items-center justify-center p-6">
          <img
            src={dataUrl}
            alt="QR Code Preview"
            className="w-full max-w-[280px] rounded-lg animate-scale-in"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}
    </div>
  )
}