import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

// Default favicon URL in case we can't fetch from the database
const DEFAULT_FAVICON_URL =
  "https://uenczyfmsqiafcjrlial.supabase.co/storage/v1/object/public/favicons//watercolor-sun-transparent.ico"

export async function generateMetadata(): Promise<Metadata> {
  // Try to fetch favicon URL from settings
  let faviconUrl = DEFAULT_FAVICON_URL
  let siteName = "Art Market - Premium Coloring Pages"
  let siteDescription = "Discover high-quality coloring pages for all ages"

  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: settingsData } = await supabase.from("site_settings").select("*")

    if (settingsData) {
      const settings = settingsData.reduce(
        (acc, item) => {
          acc[item.key] = item.value
          return acc
        },
        {} as Record<string, string>,
      )

      if (settings.favicon_url) {
        faviconUrl = settings.favicon_url
      }

      if (settings.site_name) {
        siteName = settings.site_name
      }

      if (settings.site_description) {
        siteDescription = settings.site_description
      }
    }
  } catch (error) {
    console.error("Error fetching site settings:", error)
  }

  return {
    title: siteName,
    description: siteDescription,
    manifest: "/manifest.json",
    authors: [{ name: "Sonya Kern", url: "mailto:sonyakern605@gmail.com" }],
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  }
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

export const metadata = {
      generator: 'v0.dev'
    };
