import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Link, Type, User, Wifi, Palette, Layers } from "lucide-react"
import { UrlForm } from "@/components/forms/UrlForm"
import { TextForm } from "@/components/forms/TextForm"
import { ContactForm } from "@/components/forms/ContactForm"
import { WifiForm } from "@/components/forms/WifiForm"
import { StylePanel } from "@/components/StylePanel"
import { QRPreview } from "@/components/QRPreview"
import { DownloadPanel } from "@/components/DownloadPanel"
import { BatchPanel } from "@/components/BatchPanel"
import {
  DEFAULT_STYLE,
  formatContactVCard,
  formatWifiString,
  type QRDataType,
  type QRStyleOptions,
  type ContactData,
  type WifiData,
} from "@/lib/qr-types"

const tabs: { type: QRDataType; label: string; icon: React.ReactNode }[] = [
  { type: "url", label: "URL", icon: <Link className="h-4 w-4" /> },
  { type: "text", label: "文本", icon: <Type className="h-4 w-4" /> },
  { type: "contact", label: "联系人", icon: <User className="h-4 w-4" /> },
  { type: "wifi", label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
]

const sidebarSections = [
  { id: "style" as const, label: "外观", icon: <Palette className="h-4 w-4" /> },
  { id: "batch" as const, label: "批量", icon: <Layers className="h-4 w-4" /> },
]

type SidebarSection = "style" | "batch"

function App() {
  const [activeType, setActiveType] = useState<QRDataType>("url")
  const [activeSidebar, setActiveSidebar] = useState<SidebarSection>("style")
  const [style, setStyle] = useState<QRStyleOptions>(DEFAULT_STYLE)

  // Data states
  const [urlValue, setUrlValue] = useState("")
  const [textValue, setTextValue] = useState("")
  const [contactValue, setContactValue] = useState<ContactData>({
    name: "",
    phone: "",
    email: "",
    organization: "",
    title: "",
    url: "",
  })
  const [wifiValue, setWifiValue] = useState<WifiData>({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  })

  const qrData = useMemo(() => {
    switch (activeType) {
      case "url":
        return urlValue
      case "text":
        return textValue
      case "contact":
        return contactValue.name ? formatContactVCard(contactValue) : ""
      case "wifi":
        return wifiValue.ssid ? formatWifiString(wifiValue) : ""
    }
  }, [activeType, urlValue, textValue, contactValue, wifiValue])

  const safeLabel = useMemo(() => {
    try {
      switch (activeType) {
        case "url":
          return urlValue ? new URL(urlValue).hostname : "url"
        case "text":
          return textValue.slice(0, 20) || "text"
        case "contact":
          return contactValue.name || "contact"
        case "wifi":
          return wifiValue.ssid || "wifi"
        default:
          return "qrcode"
      }
    } catch {
      return "qrcode"
    }
  }, [activeType, urlValue, textValue, contactValue, wifiValue])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="hsl(0 0% 100%)" />
                <rect x="14" y="3" width="7" height="7" rx="1" fill="hsl(0 0% 100%)" />
                <rect x="3" y="14" width="7" height="7" rx="1" fill="hsl(0 0% 100%)" />
                <rect x="14" y="14" width="3" height="3" fill="hsl(0 0% 100%)" />
                <rect x="18" y="18" width="3" height="3" fill="hsl(0 0% 100%)" />
              </svg>
            </div>
            <h1 className="text-base font-semibold text-foreground tracking-tight">QR Studio</h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">专业二维码生成器</p>
        </div>
      </header>

      {/* Hero banner */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/images/hero-pattern.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative container max-w-7xl mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            创建精美二维码
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            支持 URL、文本、联系人、WiFi — 自定义颜色和 Logo，批量生成，高清导出
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left - Input */}
          <div className="lg:col-span-5 space-y-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>内容</CardTitle>
                <CardDescription>选择类型并输入二维码数据</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type tabs */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-surface">
                  {tabs.map((tab) => (
                    <button
                      key={tab.type}
                      onClick={() => setActiveType(tab.type)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-smooth ${
                        activeType === tab.type
                          ? "bg-card text-foreground shadow-card"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <div className="min-h-[140px]">
                  {activeType === "url" && <UrlForm value={urlValue} onChange={setUrlValue} />}
                  {activeType === "text" && <TextForm value={textValue} onChange={setTextValue} />}
                  {activeType === "contact" && <ContactForm value={contactValue} onChange={setContactValue} />}
                  {activeType === "wifi" && <WifiForm value={wifiValue} onChange={setWifiValue} />}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar sections for mobile */}
            <div className="lg:hidden space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Palette className="h-4 w-4 text-primary" />
                    自定义外观
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StylePanel style={style} onChange={setStyle} />
                </CardContent>
              </Card>
              <BatchPanel style={style} />
            </div>
          </div>

          {/* Center - Preview */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>预览</CardTitle>
              </CardHeader>
              <CardContent>
                <QRPreview
                  data={qrData}
                  style={style}
                  className="aspect-square"
                />
              </CardContent>
            </Card>
            <DownloadPanel data={qrData} style={style} label={safeLabel} />
          </div>

          {/* Right - Style & Batch */}
          <div className="hidden lg:block lg:col-span-3 space-y-5">
            {/* Section tabs */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-surface">
              {sidebarSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSidebar(section.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-smooth ${
                    activeSidebar === section.id
                      ? "bg-card text-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </div>

            {activeSidebar === "style" && (
              <Card className="animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">自定义外观</CardTitle>
                </CardHeader>
                <CardContent>
                  <StylePanel style={style} onChange={setStyle} />
                </CardContent>
              </Card>
            )}

            {activeSidebar === "batch" && (
              <div className="animate-fade-in">
                <BatchPanel style={style} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 mt-12 py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center">
            QR Studio — 输入数据，自定义外观，一键导出高清二维码
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App