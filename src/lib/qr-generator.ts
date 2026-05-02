import QRCode from "qrcode"
import type { QRStyleOptions } from "./qr-types"

export async function generateQRDataUrl(
  data: string,
  style: QRStyleOptions,
  size: number = 512
): Promise<string> {
  const qrDataUrl = await QRCode.toDataURL(data, {
    width: size,
    margin: 2,
    color: {
      dark: style.foreground,
      light: style.background,
    },
    errorCorrectionLevel: style.errorCorrectionLevel,
  })

  if (!style.logoUrl) return qrDataUrl

  // Draw logo on top of QR code
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!

    const qrImg = new Image()
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, size, size)

      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.onload = () => {
        const logoPixelSize = (size * style.logoSize) / 100
        const x = (size - logoPixelSize) / 2
        const y = (size - logoPixelSize) / 2

        // White background behind logo
        const padding = logoPixelSize * 0.12
        ctx.fillStyle = style.background
        ctx.beginPath()
        ctx.roundRect(
          x - padding,
          y - padding,
          logoPixelSize + padding * 2,
          logoPixelSize + padding * 2,
          logoPixelSize * 0.1
        )
        ctx.fill()

        // Draw logo
        ctx.drawImage(logoImg, x, y, logoPixelSize, logoPixelSize)
        resolve(canvas.toDataURL("image/png"))
      }
      logoImg.onerror = () => {
        resolve(qrDataUrl)
      }
      logoImg.src = style.logoUrl!
    }
    qrImg.src = qrDataUrl
  })
}

export async function generateQRSvg(
  data: string,
  style: QRStyleOptions
): Promise<string> {
  return QRCode.toString(data, {
    type: "svg",
    margin: 2,
    color: {
      dark: style.foreground,
      light: style.background,
    },
    errorCorrectionLevel: style.errorCorrectionLevel,
  })
}