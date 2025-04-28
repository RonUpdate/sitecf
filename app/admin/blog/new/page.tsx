"use client"

import type React from "react"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewBlogPostPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { error } = await supabase.from("blog_posts").insert({ title, content })

    if (error) {
      console.error("Ошибка создания поста:", error.message)
      alert("Ошибка: " + error.message)
    } else {
      router.push("/admin/blog")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Добавить пост в блог</h1>
      <input
        type="text"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="block w-full mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Текст поста"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="block w-full mb-4 p-2 border rounded h-40"
      />
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Сохранить
      </button>
    </form>
  )
}
