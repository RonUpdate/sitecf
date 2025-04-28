import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "@/types/supabase"

export async function requireAuth() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    return session
  } catch (error) {
    console.error("Auth error:", error)
    redirect("/error")
  }
}

export async function requireAdmin() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/unauthorized")
    }

    // Check if the user is an admin using a direct query without circular references
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("id, email")
      .eq("email", session.user.email)
      .single()

    if (error || !adminUser) {
      console.error("Admin check failed:", error)
      redirect("/forbidden")
    }

    return { session, adminUser }
  } catch (error) {
    console.error("Admin check error:", error)
    redirect("/error")
  }
}

export async function isAdmin(email: string): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

    // Simple query that avoids circular references
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("id, email")
      .eq("email", email)
      .single()

    if (error) {
      console.error("Error checking admin status:", error)
      return false
    }

    return !!adminUser
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

export async function requireRole(allowedRoles: string[]) {
  try {
    const session = await requireAuth()
    const cookieStore = cookies()
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

    // Get the user's role from Supabase
    const { data: userRole, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (error || !userRole || !allowedRoles.includes(userRole.role)) {
      redirect("/forbidden")
    }

    return { session, role: userRole.role }
  } catch (error) {
    console.error("Role check error:", error)
    redirect("/error")
  }
}

export async function requireResourceOwner(resourceTable: string, resourceId: string) {
  try {
    const session = await requireAuth()
    const cookieStore = cookies()
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

    const { data: resource, error } = await supabase.from(resourceTable).select("user_id").eq("id", resourceId).single()

    if (error || !resource || resource.user_id !== session.user.id) {
      redirect("/forbidden")
    }

    return { session, resource }
  } catch (error) {
    console.error("Resource owner check error:", error)
    redirect("/error")
  }
}
