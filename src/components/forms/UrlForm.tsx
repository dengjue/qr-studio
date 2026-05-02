import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  value: string
  onChange: (val: string) => void
}

export function UrlForm({ value, onChange }: Props) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="url-input">网址链接</Label>
        <Input
          id="url-input"
          type="url"
          placeholder="https://example.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        输入完整的 URL 地址，扫码后会在浏览器中打开
      </p>
    </div>
  )
}