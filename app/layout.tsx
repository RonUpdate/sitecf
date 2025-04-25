import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

// Use a simple static metadata export instead of the dynamic function
// that was causing issues
export const metadata: Metadata = {
  title: "Art Market - Premium Coloring Pages",
  description: "Discover high-quality coloring pages for all ages",
  manifest: "/manifest.json",
  icons: {
    icon: "https://uenczyfmsqiafcjrlial.supabase.co/storage/v1/object/public/favicons//watercolor-sun-transparent.ico",
    shortcut:
      "https://uenczyfmsqiafcjrlial.supabase.co/storage/v1/object/public/favicons//watercolor-sun-transparent.ico",
    apple: "https://uenczyfmsqiafcjrlial.supabase.co/storage/v1/object/public/favicons//watercolor-sun-transparent.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
