import type React from "react"
import LogoutButton from "@/components/logout-button"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/admin/products" className="hover:underline">
            Товары
          </Link>
          <Link href="/admin/categories" className="hover:underline">
            Категории
          </Link>
          <Link href="/admin/blog" className="hover:underline">
            Блог
          </Link>
          <Link href="/admin/users" className="hover:underline">
            Пользователи
          </Link>
        </div>
        <LogoutButton />
      </header>

      <main className="flex-grow p-8">{children}</main>

      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-500">Admin Panel © 2025</footer>
    </div>
  )
}
