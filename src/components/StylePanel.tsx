import { useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import type { QRStyleOptions } from "@/lib/qr-types"
import { PRESET_COLORS } from "@/lib/qr-types"

interface Props {
  style: QRStyleOptions
  onChange: (style: QRStyleOptions) => void
}

const errorLevels: { value: QRStyleOptions["errorCorrectionLevel"]; label: string; desc: string }[] = [
  { value: "L", label: "L", desc: "7%" },
  { value: "M", label: "M", desc: "15%" },
  { value: "Q", label: "Q", desc: "25%" },
  { value: "H", label: "H", desc: "30%" },
]

export function StylePanel({ style, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onChange({ ...style, logoUrl: ev.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    onChange({ ...style, logoUrl: null })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-5">
      {/* Preset colors */}
      <div className="space-y-2">
        <Label>配色方案</Label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              title={preset.name}
              onClick={() => onChange({ ...style, foreground: preset.fg, background: preset.bg })}
              className={`group relative h-9 rounded-lg border overflow-hidden transition-smooth hover:scale-105 ${
                style.foreground === preset.fg && style.background === preset.bg
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "border-input hover:border-primary/40"
              }`}
            >
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full" style={{ backgroundColor: preset.fg }} />
                <div className="w-1/2 h-full" style={{ backgroundColor: preset.bg }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom colors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="fg-color">前景色</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              id="fg-color"
              value={style.foreground}
              onChange={(e) => onChange({ ...style, foreground: e.target.value })}
              className="h-10 w-10 rounded-lg border border-input cursor-pointer shrink-0"
            />
            <Input
              value={style.foreground}
              onChange={(e) => onChange({ ...style, foreground: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bg-color">背景色</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              id="bg-color"
              value={style.background}
              onChange={(e) => onChange({ ...style, background: e.target.value })}
              className="h-10 w-10 rounded-lg border border-input cursor-pointer shrink-0"
            />
            <Input
              value={style.background}
              onChange={(e) => onChange({ ...style, background: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Error correction level */}
      <div className="space-y-2">
        <Label>纠错等级</Label>
        <div className="flex gap-2">
          {errorLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange({ ...style, errorCorrectionLevel: level.value })}
              className={`flex-1 flex flex-col items-center rounded-lg border px-2 py-2 transition-smooth ${
                style.errorCorrectionLevel === level.value
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-input bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              <span className="text-sm font-semibold">{level.label}</span>
              <span className="text-[10px] opacity-70">{level.desc}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          添加 Logo 建议使用 H 级别以确保可扫描
        </p>
      </div>

      {/* Logo upload */}
      <div className="space-y-2">
        <Label>中心 Logo</Label>
        {style.logoUrl ? (
          <div className="flex items-center gap-3 rounded-lg border border-input bg-card p-3">
            <img
              src={style.logoUrl}
              alt="Logo"
              className="h-10 w-10 rounded-md object-contain"
            />
            <span className="flex-1 text-sm text-muted-foreground truncate">已上传 Logo</span>
            <Button variant="ghost" size="icon" onClick={removeLogo}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-card px-4 py-6 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-smooth"
          >
            <Upload className="h-4 w-4" />
            点击上传 Logo 图片
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />

        {style.logoUrl && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Logo 大小</Label>
              <span className="text-xs text-muted-foreground">{style.logoSize}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={35}
              value={style.logoSize}
              onChange={(e) => onChange({ ...style, logoSize: Number(e.target.value) })}
              className="w-full accent-[hsl(252,62%,55%)]"
            />
          </div>
        )}
      </div>
    </div>
  )
}