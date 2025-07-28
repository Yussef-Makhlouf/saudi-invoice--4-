import type React from "react"
import type { Metadata } from "next"
import "./globals.css"




export const metadata: Metadata = {
  title: "نموذج عرض سعر الكتروني شركة الفشني",
  description: "نموذج عرض سعر الكتروني تابع لشركة الفشني للدعاية والاعلان والتسويق الالكتروني",
  keywords: "عرض سعر الكتروني، شركة الفشني، مقاولات، السعودية",
  authors: [{ name: "شركة الفشني" }],
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
    <html lang="ar" dir="rtl" >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1375bd" />
        <link rel="icon" href="/main-logo.png" />
      </head>
      <body className="antialiased" dir="rtl">
        {children}
      </body>
    </html>
  )
}
