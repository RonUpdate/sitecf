"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "editor",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function addUser() {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (!newUser.email || !newUser.name) {
        throw new Error("Email and name are required")
      }

      const supabase = getSupabaseClient()
      const { error } = await supabase.from("admin_users").insert([
        {
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      ])

      if (error) throw error

      setSuccess(`User ${newUser.name} added successfully`)
      setNewUser({ email: "", name: "", role: "editor" })
      setIsAddUserOpen(false)
      fetchUsers()
    } catch (err) {
      console.error("Error adding user:", err)
      setError(err instanceof Error ? err.message : "Failed to add user")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return
    }

    setError(null)
    setSuccess(null)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("admin_users").delete().eq("id", id)

      if (error) throw error

      setSuccess(`User ${name} deleted successfully`)
      fetchUsers()
    } catch (err) {
      console.error("Error deleting user:", err)
      setError("Failed to delete user. Please try again.")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return <div>Users</div>
}
