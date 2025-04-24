import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { Suspense } from "react"
import { MobileMenu } from "@/components/mobile-menu"
import { Settings } from "lucide-react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="w-full bg-white border-b dark:bg-gray-950 dark:border-gray-800">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="text-xl font-bold text-primary">
            Art Market
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Suspense fallback={null}>
              <SearchForm className="max-w-xs" />
            </Suspense>
            <Link href="/featured">
              <Button variant="ghost">Coloring Pages</Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
          </div>
          <MobileMenu />
        </div>
      </header>
      <main>{children}</main>
      <footer className="w-full bg-gray-50 border-t dark:bg-gray-950 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold mb-4">Art Market</h3>
              <p className="text-gray-500 dark:text-gray-400">Premium coloring pages from Creative Factory</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-primary dark:text-gray-400">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-500 dark:text-gray-400">support@artmarket.com</p>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Art Market. All rights reserved.
            </p>
            <Link href="/admin" className="text-gray-400 hover:text-gray-500 transition-colors">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Admin Panel</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
