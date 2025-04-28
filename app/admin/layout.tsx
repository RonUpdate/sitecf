import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { AdminSidebar } from "@/components/admin-sidebar"

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

    if (!session) {
      return redirect("/login")
    }

    // Check if user is an admin
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    if (error) {
      console.error("Error checking admin status:", error)
      // Don't redirect, just show an error message in the UI
    }

    if (!adminUser) {
      return redirect("/unauthorized")
    }

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
        <div className="p-8 bg-red-50 rounded-lg">
          <h1 className="text-2xl font-bold text-red-700">Error loading admin panel</h1>
          <p className="mt-2">There was a problem authenticating your session. Please try logging in again.</p>
          <a href="/login" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded">
            Go to Login
          </a>
        </div>
      </div>
    )
  }
}
