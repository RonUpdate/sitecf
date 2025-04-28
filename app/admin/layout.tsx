import type React from "react"
import { createServerSupabaseClient } from "@/lib/supabase"
import { AdminSidebar } from "@/components/admin-sidebar"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const supabase = createServerSupabaseClient()

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if user is an admin
    let isAdmin = false
    let adminError = null

    if (session) {
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", session.user.email)
        .single()

      if (error) {
        adminError = error
        console.error("Error checking admin status:", error)
      } else {
        isAdmin = !!adminUser
      }
    }

    // Instead of redirecting, render appropriate UI based on auth state
    if (!session) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="p-8 bg-yellow-50 rounded-lg max-w-md">
            <h1 className="text-2xl font-bold text-yellow-700">Authentication Required</h1>
            <p className="mt-2">You need to be logged in to access the admin panel.</p>
            <Link href="/login" className="mt-4 inline-block px-4 py-2 bg-yellow-600 text-white rounded">
              Go to Login
            </Link>
          </div>
        </div>
      )
    }

    if (adminError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="p-8 bg-red-50 rounded-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-700">Error Checking Admin Status</h1>
            <p className="mt-2">There was a problem verifying your admin privileges.</p>
            <p className="mt-2 text-sm text-red-500">{adminError.message}</p>
            <Link href="/" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded">
              Return to Home
            </Link>
          </div>
        </div>
      )
    }

    if (!isAdmin) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="p-8 bg-orange-50 rounded-lg max-w-md">
            <h1 className="text-2xl font-bold text-orange-700">Access Denied</h1>
            <p className="mt-2">You don't have permission to access the admin panel.</p>
            <p className="mt-2">Please contact an administrator if you believe this is an error.</p>
            <Link href="/" className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded">
              Return to Home
            </Link>
          </div>
        </div>
      )
    }

    // User is authenticated and is an admin
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    )
  } catch (error) {
    console.error("Admin layout error:", error)
    // Return an error component instead of redirecting
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-8 bg-red-50 rounded-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-700">Error Loading Admin Panel</h1>
          <p className="mt-2">There was a problem loading the admin panel.</p>
          <p className="mt-2 text-sm text-red-500">{error instanceof Error ? error.message : "Unknown error"}</p>
          <div className="mt-4 flex gap-4">
            <Link href="/login" className="inline-block px-4 py-2 bg-red-600 text-white rounded">
              Go to Login
            </Link>
            <Link href="/" className="inline-block px-4 py-2 bg-gray-600 text-white rounded">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
