export type QRDataType = "url" | "text" | "contact" | "wifi"

export interface QRStyleOptions {
  foreground: string
  background: string
  cornerRadius: number
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  logoUrl: string | null
  logoSize: number
}

export interface ContactData {
  name: string
  phone: string
  email: string
  organization: string
  title: string
  url: string
}

export interface WifiData {
  ssid: string
  password: string
  encryption: "WPA" | "WEP" | "nopass"
  hidden: boolean
}

export interface QRItem {
  id: string
  type: QRDataType
  label: string
  data: string
  rawData: {
    url?: string
    text?: string
    contact?: ContactData
    wifi?: WifiData
  }
}

export interface ExportSize {
  label: string
  width: number
  height: number
}

export const EXPORT_SIZES: ExportSize[] = [
  { label: "256 x 256", width: 256, height: 256 },
  { label: "512 x 512", width: 512, height: 512 },
  { label: "1024 x 1024", width: 1024, height: 1024 },
  { label: "2048 x 2048", width: 2048, height: 2048 },
]

export const DEFAULT_STYLE: QRStyleOptions = {
  foreground: "#6C3AED",
  background: "#FFFFFF",
  cornerRadius: 0,
  errorCorrectionLevel: "H",
  logoUrl: null,
  logoSize: 20,
}

export const PRESET_COLORS = [
  { name: "紫罗兰", fg: "#6C3AED", bg: "#FFFFFF" },
  { name: "深蓝", fg: "#1E40AF", bg: "#FFFFFF" },
  { name: "翡翠绿", fg: "#059669", bg: "#FFFFFF" },
  { name: "炭黑", fg: "#1C1917", bg: "#FFFFFF" },
  { name: "珊瑚橙", fg: "#EA580C", bg: "#FFFFFF" },
  { name: "玫瑰红", fg: "#E11D48", bg: "#FFFFFF" },
  { name: "琥珀金", fg: "#B45309", bg: "#FFFFFF" },
  { name: "暗夜紫", fg: "#A78BFA", bg: "#1E1B2E" },
  { name: "暗夜蓝", fg: "#60A5FA", bg: "#0F172A" },
  { name: "暗夜绿", fg: "#34D399", bg: "#022C22" },
]

export function formatContactVCard(contact: ContactData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${contact.name}`,
    `FN:${contact.name}`,
  ]
  if (contact.phone) lines.push(`TEL:${contact.phone}`)
  if (contact.email) lines.push(`EMAIL:${contact.email}`)
  if (contact.organization) lines.push(`ORG:${contact.organization}`)
  if (contact.title) lines.push(`TITLE:${contact.title}`)
  if (contact.url) lines.push(`URL:${contact.url}`)
  lines.push("END:VCARD")
  return lines.join("\n")
}

export function formatWifiString(wifi: WifiData): string {
  const hidden = wifi.hidden ? "H:true" : ""
  return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};${hidden};`
}