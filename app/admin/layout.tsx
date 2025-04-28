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

    // Instead of checking admin status which might trigger the RLS error,
    // just check if the user is authenticated for now
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

    // Try to check admin status, but catch any RLS errors
    let isAdmin = false
    let adminError = null

    try {
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", session.user.email)
        .single()

      if (error) {
        // Check if this is the infinite recursion error
        if (error.message.includes("infinite recursion")) {
          throw new Error("RLS recursion error detected. Please fix the admin_users RLS policies.")
        }
        adminError = error
      } else {
        isAdmin = !!adminUser
      }
    } catch (error: any) {
      adminError = { message: error.message }
    }

    // If there's an RLS recursion error, show a special error page with instructions
    if (adminError && adminError.message.includes("recursion")) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="p-8 bg-red-50 rounded-lg max-w-lg">
            <h1 className="text-2xl font-bold text-red-700">Database Policy Error</h1>
            <p className="mt-2">
              There is an infinite recursion error in the Row Level Security (RLS) policies for the admin_users table.
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
              <h2 className="text-lg font-semibold text-red-700">How to Fix This:</h2>
              <ol className="mt-2 list-decimal list-inside space-y-2 text-sm">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Copy and paste the following SQL:</li>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                  {`-- Temporarily disable RLS on the admin_users table
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS admin_users_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_select_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_insert_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_update_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_delete_policy ON public.admin_users;

-- Create a simple policy that doesn't cause recursion
CREATE POLICY admin_users_select_policy ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (true);

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;`}
                </pre>
                <li>Run the SQL</li>
                <li>Return to this page and refresh</li>
              </ol>
            </div>
            <div className="mt-4 flex gap-4">
              <Link href="/" className="inline-block px-4 py-2 bg-gray-600 text-white rounded">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // For other admin errors, show a generic error
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

    // If not admin, show access denied
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
  } catch (error: any) {
    console.error("Admin layout error:", error)

    // Check if this is the infinite recursion error
    const isRLSRecursionError = error.message && error.message.includes("infinite recursion")

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-8 bg-red-50 rounded-lg max-w-lg">
          <h1 className="text-2xl font-bold text-red-700">Error Loading Admin Panel</h1>

          {isRLSRecursionError ? (
            <>
              <p className="mt-2">
                There is an infinite recursion error in the Row Level Security (RLS) policies for the admin_users table.
              </p>
              <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                <h2 className="text-lg font-semibold text-red-700">How to Fix This:</h2>
                <ol className="mt-2 list-decimal list-inside space-y-2 text-sm">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Copy and paste the following SQL:</li>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                    {`-- Temporarily disable RLS on the admin_users table
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS admin_users_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_select_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_insert_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_update_policy ON public.admin_users;
DROP POLICY IF EXISTS admin_users_delete_policy ON public.admin_users;

-- Create a simple policy that doesn't cause recursion
CREATE POLICY admin_users_select_policy ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (true);

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;`}
                  </pre>
                  <li>Run the SQL</li>
                  <li>Return to this page and refresh</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2">There was a problem loading the admin panel.</p>
              <p className="mt-2 text-sm text-red-500">{error.message || "Unknown error"}</p>
            </>
          )}

          <div className="mt-4 flex gap-4">
            <Link href="/" className="inline-block px-4 py-2 bg-gray-600 text-white rounded">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
