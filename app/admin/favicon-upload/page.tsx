"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function FaviconUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const uploadFavicon = async () => {
    if (!file) {
      setError("Пожалуйста, выберите файл")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      // Загружаем файл в публичное хранилище
      const { data, error } = await supabase.storage.from("public").upload(`favicon.png`, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) throw error

      // Получаем публичный URL
      const { data: publicUrlData } = supabase.storage.from("public").getPublicUrl("favicon.png")

      setUploadedUrl(publicUrlData.publicUrl)
    } catch (err) {
      console.error("Ошибка загрузки:", err)
      setError("Ошибка при загрузке файла. Проверьте консоль для деталей.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Загрузка фавиконки в Supabase</h1>

      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <input type="file" accept="image/png,image/x-icon,image/ico" onChange={handleFileChange} className="w-full" />
        </div>

        <Button onClick={uploadFavicon} disabled={!file || uploading} className="w-full">
          {uploading ? "Загрузка..." : "Загрузить фавиконку"}
        </Button>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

        {uploadedUrl && (
          <div className="bg-green-50 text-green-600 p-4 rounded-md">
            <p className="font-medium mb-2">Фавиконка успешно загружена!</p>
            <p className="text-sm mb-2">URL для использования:</p>
            <code className="block bg-green-100 p-2 rounded text-xs break-all">{uploadedUrl}</code>
            <p className="mt-4 text-xs">Обновите переменную FAVICON_URL в файле app/layout.tsx</p>
          </div>
        )}
      </div>
    </div>
  )
}
