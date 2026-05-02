import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ContactData } from "@/lib/qr-types"

interface Props {
  value: ContactData
  onChange: (val: ContactData) => void
}

const fields: { key: keyof ContactData; label: string; placeholder: string; type?: string }[] = [
  { key: "name", label: "姓名", placeholder: "张三" },
  { key: "phone", label: "手机号", placeholder: "+86 138 0000 0000", type: "tel" },
  { key: "email", label: "邮箱", placeholder: "name@example.com", type: "email" },
  { key: "organization", label: "公司", placeholder: "公司名称" },
  { key: "title", label: "职位", placeholder: "产品经理" },
  { key: "url", label: "网站", placeholder: "https://...", type: "url" },
]

export function ContactForm({ value, onChange }: Props) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.key} className={f.key === "name" || f.key === "phone" ? "col-span-2 sm:col-span-1" : "col-span-2 sm:col-span-1"}>
            <div className="space-y-1.5">
              <Label htmlFor={`contact-${f.key}`}>{f.label}</Label>
              <Input
                id={`contact-${f.key}`}
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={value[f.key]}
                onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        生成 vCard 格式，扫码可直接添加联系人
      </p>
    </div>
  )
}