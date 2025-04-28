"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { fixAdminUsersRLS } from "./actions"

export default function FixRLSPoliciesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

  const handleFixRLS = async () => {
    setIsLoading(true)
    try {
      const result = await fixAdminUsersRLS()
      setResult(result)
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fix RLS Policies</h1>
        <p className="text-muted-foreground">
          This page helps fix the infinite recursion issue in the admin_users RLS policies.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Users RLS Fix</h2>
        <p className="mb-4">
          If you're experiencing an infinite recursion error with the admin_users table, click the button below to fix
          the RLS policies.
        </p>
        <Button onClick={handleFixRLS} disabled={isLoading}>
          {isLoading ? "Fixing..." : "Fix Admin Users RLS"}
        </Button>

        {result && (
          <div className={`mt-4 p-4 rounded ${result.success ? "bg-green-50" : "bg-red-50"}`}>
            {result.success ? (
              <p className="text-green-700">RLS policies fixed successfully! Try accessing the admin panel now.</p>
            ) : (
              <p className="text-red-700">Error: {result.error}</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h3 className="font-medium text-amber-800">Important Note</h3>
        <p className="text-amber-700">
          This fix should be applied by a database administrator. It will modify the RLS policies on the admin_users
          table to prevent infinite recursion errors.
        </p>
      </div>
    </div>
  )
}
