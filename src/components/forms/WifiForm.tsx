import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { WifiData } from "@/lib/qr-types"

interface Props {
  value: WifiData
  onChange: (val: WifiData) => void
}

const encryptionOptions: { value: WifiData["encryption"]; label: string }[] = [
  { value: "WPA", label: "WPA/WPA2" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "无密码" },
]

export function WifiForm({ value, onChange }: Props) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="space-y-1.5">
        <Label htmlFor="wifi-ssid">WiFi 名称 (SSID)</Label>
        <Input
          id="wifi-ssid"
          placeholder="MyWiFi"
          value={value.ssid}
          onChange={(e) => onChange({ ...value, ssid: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>加密方式</Label>
        <div className="flex gap-2">
          {encryptionOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...value, encryption: opt.value })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-smooth ${
                value.encryption === opt.value
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-input bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {value.encryption !== "nopass" && (
        <div className="space-y-1.5 animate-fade-in">
          <Label htmlFor="wifi-pass">密码</Label>
          <Input
            id="wifi-pass"
            type="text"
            placeholder="WiFi 密码"
            value={value.password}
            onChange={(e) => onChange({ ...value, password: e.target.value })}
          />
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={value.hidden}
          onChange={(e) => onChange({ ...value, hidden: e.target.checked })}
          className="rounded border-input accent-[hsl(252,62%,55%)]"
        />
        <span className="text-sm text-muted-foreground">隐藏网络</span>
      </label>

      <p className="text-xs text-muted-foreground">
        扫码可一键连接 WiFi，无需手动输入密码
      </p>
    </div>
  )
}