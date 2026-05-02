import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, Download, Trash2, X } from "lucide-react"
import Papa from "papaparse"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { generateQRDataUrl } from "@/lib/qr-generator"
import type { QRStyleOptions, QRItem } from "@/lib/qr-types"
import { useToast } from "@/components/ui/toast"

interface Props {
  style: QRStyleOptions
}

export function BatchPanel({ style }: Props) {
  const [items, setItems] = useState<QRItem[]>([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: QRItem[] = []
        for (const row of results.data as Record<string, string>[]) {
          const label = row["label"] || row["名称"] || row["name"] || ""
          const data = row["data"] || row["内容"] || row["url"] || row["text"] || ""
          if (data.trim()) {
            parsed.push({
              id: Math.random().toString(36).slice(2),
              type: "text",
              label: label || data.slice(0, 20),
              data: data.trim(),
              rawData: { text: data.trim() },
            })
          }
        }
        if (parsed.length === 0) {
          toast("未识别到有效数据，请检查 CSV 格式", "error")
        } else {
          setItems(parsed)
          toast(`已导入 ${parsed.length} 条数据`, "success")
        }
      },
      error: () => {
        toast("CSV 解析失败", "error")
      },
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearAll = () => {
    setItems([])
  }

  const downloadAll = async () => {
    if (items.length === 0) return
    setGenerating(true)
    setProgress(0)

    try {
      const zip = new JSZip()

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const dataUrl = await generateQRDataUrl(item.data, style, 1024)
        const base64 = dataUrl.split(",")[1]
        const fileName = `${(i + 1).toString().padStart(3, "0")}-${item.label.replace(/[^\w\u4e00-\u9fff-]/g, "_")}.png`
        zip.file(fileName, base64, { base64: true })
        setProgress(Math.round(((i + 1) / items.length) * 100))
      }

      const blob = await zip.generateAsync({ type: "blob" })
      saveAs(blob, `qrcodes-batch-${items.length}.zip`)
      toast(`已导出 ${items.length} 个二维码`, "success")
    } catch {
      toast("批量导出失败", "error")
    } finally {
      setGenerating(false)
      setProgress(0)
    }
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          批量生成
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-input bg-surface/50 px-4 py-5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-smooth"
          >
            <Upload className="h-5 w-5" />
            <span>上传 CSV 文件</span>
            <span className="text-xs opacity-60">
              列头: label/名称, data/内容/url/text
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </div>

        {items.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {items.length} 条数据
              </span>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                清空
              </Button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-input p-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent/50 transition-smooth group"
                >
                  <span className="flex-1 text-xs text-foreground truncate">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{item.data}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-smooth text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              variant="gradient"
              className="w-full"
              onClick={downloadAll}
              disabled={generating}
            >
              <Download className="h-4 w-4" />
              {generating ? `生成中 ${progress}%` : `批量下载 ZIP (${items.length}个)`}
            </Button>

            {generating && (
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}