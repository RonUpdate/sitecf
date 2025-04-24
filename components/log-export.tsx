"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Loader2 } from "lucide-react"
import type { LogLevel } from "@/lib/logger"

interface LogExportProps {
  logType: LogLevel | "all"
  count: number
}

export function LogExport({ logType, count }: LogExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "json" | "csv") => {
    setIsExporting(true)
    try {
      // Получаем текущую дату для имени файла
      const date = new Date().toISOString().split("T")[0]
      const fileName = `auth-logs-${logType}-${date}.${format}`

      // Запрашиваем данные с сервера
      const response = await fetch(`/api/logs/export?format=${format}&type=${logType}`)

      if (!response.ok) {
        throw new Error(`Ошибка экспорта: ${response.statusText}`)
      }

      // Получаем данные и создаем blob
      const data = await response.text()
      const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/csv" })

      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()

      // Очищаем ресурсы
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Ошибка при экспорте логов:", error)
      alert(`Ошибка при экспорте логов: ${error.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting || count === 0}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Экспорт...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Экспорт ({count})
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("json")}>Экспорт в JSON</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>Экспорт в CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
