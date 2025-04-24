"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type UnifiedSearchProps = {
  type: "product" | "coloringPage"
  className?: string
  placeholder?: string
}

export function UnifiedSearch({ type, className, placeholder }: UnifiedSearchProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?type=${type}&q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full max-w-sm items-center space-x-2 ${className}`}>
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder={placeholder || `Поиск ${type === "product" ? "товаров" : "раскрасок"}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <Button type="submit" size="icon" className="absolute right-0 top-0 h-full rounded-l-none">
          <Search className="h-4 w-4" />
          <span className="sr-only">Поиск</span>
        </Button>
      </div>
    </form>
  )
}
