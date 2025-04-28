import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Use Next.js font optimization
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Art Market - Beautiful Coloring Pages for Everyone",
  description: "Discover a world of creativity with our premium coloring pages from Creative Factory",
  metadataBase: new URL("https://www.pinminpro.online"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Art Market - Beautiful Coloring Pages for Everyone",
    description: "Discover a world of creativity with our premium coloring pages from Creative Factory",
    url: "https://www.pinminpro.online",
    siteName: "Art Market",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Art Market - Beautiful Coloring Pages for Everyone",
    description: "Discover a world of creativity with our premium coloring pages from Creative Factory",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.className} suppressHydrationWarning>
      <head>
        {/* Manifest and theme color */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9333ea" />

        {/* Proper font preloading */}
        <link
          rel="preload"
          href="/fonts/26a46d62cd723877-s.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/6d93bde91c0c2823-s.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
