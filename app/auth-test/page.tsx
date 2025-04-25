"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// Удаляем импорт generateMetadata или Metadata, если они есть

export default function AuthTestPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          throw sessionError
        }
        setSession(sessionData.session)

        // Get user
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) {
          throw userError
        }
        setUser(userData.user)
      } catch (err: any) {
        console.error("Auth check error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading authentication status...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          ) : null}

          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-bold mb-2">Authentication Status:</h3>
            <p>User is {user ? "authenticated" : "not authenticated"}</p>
          </div>

          {user ? (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-bold mb-2">User Information:</h3>
              <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(user, null, 2)}</pre>
            </div>
          ) : null}

          {session ? (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-bold mb-2">Session Information:</h3>
              <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(session, null, 2)}</pre>
            </div>
          ) : null}

          <div className="flex gap-2 mt-4">
            {user ? (
              <Button onClick={handleSignOut}>Sign Out</Button>
            ) : (
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            )}
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Try Admin Panel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
