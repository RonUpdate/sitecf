import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { Suspense } from "react"
import { MobileMenu } from "@/components/mobile-menu"
import { Settings } from "lucide-react"
import { TermsModal } from "@/components/terms-modal"
import { PrivacyModal } from "@/components/privacy-modal"

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
        <div className="w-full px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-4">Art Market</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">Premium coloring pages from Creative Factory</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <TermsModal />
                </li>
                <li>
                  <PrivacyModal />
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">ronupert@gmail.com</p>

              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#telegram" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21.73 2.27a2 2 0 0 0-2.83 0L2.27 18.9a2 2 0 0 0 0 2.83l.06.06a2 2 0 0 0 2.83 0L21.73 5.1a2 2 0 0 0 0-2.83Z"></path>
                    <path d="M8.5 8.5 17 17"></path>
                    <path d="M17.5 17.5 20 20"></path>
                    <path d="M20 4 4 20"></path>
                  </svg>
                  <span className="sr-only">Telegram</span>
                </Link>
                <Link href="#pinterest" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="10" r="3"></circle>
                    <path d="M12 13v8"></path>
                    <path d="m9 16 3-3 3 3"></path>
                  </svg>
                  <span className="sr-only">Pinterest</span>
                </Link>
              </div>
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
