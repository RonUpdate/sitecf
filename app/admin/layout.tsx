import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user is an admin
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", session.user.email)
    .eq("role", "admin")
    .single()

  if (!adminUser) {
    redirect("/unauthorized")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block p-2 hover:bg-gray-200 rounded">
            Dashboard
          </a>
          <a href="/admin/users" className="block p-2 hover:bg-gray-200 rounded">
            Users
          </a>
          <a href="/admin/blog/posts" className="block p-2 hover:bg-gray-200 rounded">
            Blog Posts
          </a>
          <a href="/admin/blog/categories" className="block p-2 hover:bg-gray-200 rounded">
            Categories
          </a>
          <a href="/admin/blog/tags" className="block p-2 hover:bg-gray-200 rounded">
            Tags
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
