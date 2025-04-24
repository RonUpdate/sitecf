import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { Suspense } from "react"
import { MobileMenu } from "@/components/mobile-menu"
import { Settings } from "lucide-react"
import { TermsModal } from "@/components/terms-modal"
import { PrivacyModal } from "@/components/privacy-modal"
import { CopyrightYear } from "@/components/copyright-year"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
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
      <main className="flex-grow">{children}</main>
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
                <Link href="#telegram" className="hover:opacity-80 transition-opacity">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#29B6F6" />
                    <path
                      d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.3133 19.5005L19.7806 22.8523C20.3643 23.2211 21.1292 22.8533 21.2452 22.1303L22.9866 10.2088Z"
                      fill="white"
                    />
                  </svg>
                  <span className="sr-only">Telegram</span>
                </Link>
                <Link href="#pinterest" className="hover:opacity-80 transition-opacity">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#E60023" />
                    <path
                      d="M16.0001 8C11.5817 8 8.00006 11.5817 8.00006 16C8.00006 19.2208 9.97319 21.9723 12.7846 23.2769C12.7346 22.5877 12.6908 21.5262 12.8631 20.8C13.0177 20.1415 14.0546 16.1723 14.0546 16.1723C14.0546 16.1723 13.8139 15.6915 13.8139 14.9915C13.8139 13.8831 14.4546 13.0569 15.2546 13.0569C15.9393 13.0569 16.2685 13.5754 16.2685 14.1969C16.2685 14.8877 15.8331 15.9415 15.6077 16.9138C15.4177 17.7323 16.0023 18.4 16.8085 18.4C18.2531 18.4 19.3439 16.9015 19.3439 14.7262C19.3439 12.8138 18.0085 11.4969 15.9639 11.4969C13.5885 11.4969 12.1331 13.3108 12.1331 15.7415C12.1331 16.4415 12.3739 17.1354 12.7346 17.5631C12.8139 17.6546 12.8262 17.7338 12.7969 17.8262C12.7177 18.1062 12.5508 18.7138 12.5177 18.8369C12.4723 19.0046 12.3739 19.0415 12.2 18.9569C11.1823 18.4815 10.5293 16.9138 10.5293 15.7108C10.5293 13.1569 12.4723 10.0123 16.1877 10.0123C19.1908 10.0123 21.4708 12.6215 21.4708 14.8369C21.4708 17.8877 19.5823 19.8492 17.0039 19.8492C16.1631 19.8492 15.3693 19.4092 15.0893 18.8862C15.0893 18.8862 14.6539 20.5046 14.5439 20.8738C14.3408 21.5877 13.7739 22.4677 13.4323 22.9854C14.2446 23.2346 15.1039 23.3754 16.0001 23.3754C20.4185 23.3754 24.0001 19.7938 24.0001 15.3754C24.0001 10.957 20.4185 8 16.0001 8Z"
                      fill="white"
                    />
                  </svg>
                  <span className="sr-only">Pinterest</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400">
              © <CopyrightYear /> Art Market. All rights reserved.
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
