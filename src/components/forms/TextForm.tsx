import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Props {
  value: string
  onChange: (val: string) => void
}

export function TextForm({ value, onChange }: Props) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="text-input">文本内容</Label>
        <Textarea
          id="text-input"
          placeholder="输入任何文本内容..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        支持任意文本，扫码后显示文本内容
      </p>
    </div>
  )
}