"use client"

import { useEffect, useState } from "react"

export function CopyrightYear() {
  const [year, setYear] = useState("2025") // Default fallback year

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  return <>{year}</>
}
