"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function FaviconGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    generateFavicon()
  }, [])

  const generateFavicon = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Очищаем холст
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Фон
    ctx.fillStyle = "#6366f1" // Индиго цвет
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Текст (инициалы SK)
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 40px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("SK", canvas.width / 2, canvas.height / 2)

    // Добавляем небольшую обводку
    ctx.strokeStyle = "#c7d2fe"
    ctx.lineWidth = 4
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8)
  }

  const downloadFavicon = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Конвертируем canvas в PNG
    const dataUrl = canvas.toDataURL("image/png")

    // Создаем ссылку для скачивания
    const link = document.createElement("a")
    link.download = "favicon.png"
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-2xl font-bold">Генератор фавиконки</h1>
      <canvas ref={canvasRef} width={64} height={64} className="border border-gray-300 rounded-md" />
      <div className="flex gap-4">
        <Button onClick={generateFavicon}>Сгенерировать</Button>
        <Button onClick={downloadFavicon}>Скачать</Button>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>1. Нажмите "Скачать" чтобы получить PNG файл</p>
        <p>2. Загрузите файл в хранилище Supabase</p>
        <p>3. Скопируйте URL и обновите ссылки на фавиконку в коде</p>
      </div>
    </div>
  )
}
