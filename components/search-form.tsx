"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchForm({ className }: { className?: string }) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full items-center space-x-1 ${className}`}>
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-8 h-8 text-sm bg-muted/50"
        />
        <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full w-8 p-0">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}
