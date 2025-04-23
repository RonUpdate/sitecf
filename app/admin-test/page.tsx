"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminTestPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    getUser()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div>
              <p className="mb-4">Welcome, {user.email}!</p>
              <p className="mb-4">
                This is a test admin page that doesn't require authentication checks in the layout.
              </p>
              <div className="flex gap-2">
                <Link href="/admin">
                  <Button>Go to Real Admin</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">You are not logged in.</p>
              <div className="flex gap-2">
                <Link href="/login">
                  <Button>Go to Login</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
