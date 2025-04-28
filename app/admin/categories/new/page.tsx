"use client"

import type React from "react"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewCategoryPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [name, setName] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { error } = await supabase.from("categories").insert({ name })

    if (error) {
      console.error("Ошибка создания категории:", error.message)
      alert("Ошибка: " + error.message)
    } else {
      router.push("/admin/categories")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Добавить категорию</h1>
      <input
        type="text"
        placeholder="Название категории"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="block w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Сохранить
      </button>
    </form>
  )
}
