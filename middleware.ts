import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get current path
  const path = req.nextUrl.pathname

  // Check if path is admin-related
  const isAdminPath = path.startsWith("/admin")
  const isLoginPath = path === "/login"
  const isErrorPath = path === "/unauthorized" || path === "/forbidden" || path === "/error"

  // Skip check for error paths
  if (isErrorPath) {
    return res
  }

  try {
    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If already authenticated and trying to access login page
    if (isLoginPath && session) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // For admin paths, we'll let the layout handle the auth check
    // This prevents redirect loops and errors
  } catch (error) {
    console.error("Middleware error:", error)
    // Let the request through to be handled by the layout
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/unauthorized", "/forbidden", "/error"],
}
