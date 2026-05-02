import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ChevronDown } from "lucide-react"
import { generateQRDataUrl, generateQRSvg } from "@/lib/qr-generator"
import { EXPORT_SIZES, type QRStyleOptions } from "@/lib/qr-types"
import { useToast } from "@/components/ui/toast"

interface Props {
  data: string
  style: QRStyleOptions
  label?: string
}

export function DownloadPanel({ data, style, label }: Props) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { toast } = useToast()

  const downloadPNG = async (width: number, sizeLabel: string) => {
    if (!data.trim()) {
      toast("请先输入内容", "error")
      return
    }
    setDownloading(true)
    try {
      const dataUrl = await generateQRDataUrl(data, style, width)
      const link = document.createElement("a")
      link.download = `qrcode-${label || "export"}-${width}x${width}.png`
      link.href = dataUrl
      link.click()
      toast(`PNG ${sizeLabel} 下载成功`, "success")
    } catch {
      toast("下载失败，请重试", "error")
    } finally {
      setDownloading(false)
      setOpen(false)
    }
  }

  const downloadSVG = async () => {
    if (!data.trim()) {
      toast("请先输入内容", "error")
      return
    }
    setDownloading(true)
    try {
      const svg = await generateQRSvg(data, style)
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `qrcode-${label || "export"}.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      toast("SVG 下载成功", "success")
    } catch {
      toast("下载失败，请重试", "error")
    } finally {
      setDownloading(false)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Button
          variant="gradient"
          size="lg"
          className="flex-1"
          disabled={!data.trim() || downloading}
          onClick={() => downloadPNG(1024, "1024 x 1024")}
        >
          <Download className="h-4 w-4" />
          {downloading ? "导出中..." : "下载 PNG"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setOpen(!open)}
          disabled={!data.trim()}
        >
          <ChevronDown className={`h-4 w-4 transition-smooth ${open ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border bg-card shadow-card-hover p-2 z-20 animate-scale-in">
          <p className="px-2 py-1 text-xs font-medium text-muted-foreground">PNG 尺寸</p>
          {EXPORT_SIZES.map((size) => (
            <button
              key={size.label}
              onClick={() => downloadPNG(size.width, size.label)}
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent transition-smooth"
            >
              {size.label}
            </button>
          ))}
          <div className="my-1 border-t border-border" />
          <button
            onClick={downloadSVG}
            className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent transition-smooth"
          >
            SVG (矢量图)
          </button>
        </div>
      )}
    </div>
  )
}