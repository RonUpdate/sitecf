"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSupabaseQuery } from "@/hooks/use-swr-fetch"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

type AdminUser = {
  id: string
  email: string
  name?: string
}

export function AdminSidebar() {
  const pathname = usePathname()
  const supabase = createClientComponentClient<Database>()

  // Use SWR to fetch admin user data
  const {
    data: adminUser,
    error,
    isLoading,
  } = useSupabaseQuery<AdminUser>(
    async (supabase) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { data: null, error: new Error("User not found") }

      return supabase.from("admin_users").select("*").eq("email", user.email).single()
    },
    "admin-user-profile",
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    },
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

        {isLoading ? (
          <div className="mb-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="mb-6 text-sm text-red-500">Error loading profile</div>
        ) : adminUser ? (
          <div className="mb-6">
            <p className="text-sm font-medium">{adminUser.name || adminUser.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        ) : null}

        <nav className="space-y-1">
          <Link
            href="/admin"
            className={`block px-3 py-2 rounded-md text-sm ${
              pathname === "/admin"
                ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/categories"
            className={`block px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/categories" || pathname.startsWith("/admin/categories/")
                ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Categories
          </Link>

          <Link
            href="/admin/coloring-pages"
            className={`block px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/coloring-pages" || pathname.startsWith("/admin/coloring-pages/")
                ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Coloring Pages
          </Link>

          <Link
            href="/admin/blog"
            className={`block px-3 py-2 rounded-md text-sm ${
              pathname === "/admin/blog" || pathname.startsWith("/admin/blog/")
                ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Blog
          </Link>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
