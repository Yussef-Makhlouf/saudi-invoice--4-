import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Cairo } from "next/font/google"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "نموذج فاتورة شركة القوس الماسي",
  description: "نموذج فاتوره تابع لشركة القوس الماسي للمقاولات",
  keywords: "فاتورة، شركة القوس الماسي، مقاولات، السعودية",
  authors: [{ name: "شركة القوس الماسي" }],
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1375bd" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-cairo antialiased" dir="rtl">
        {children}
      </body>
    </html>
  )
}
