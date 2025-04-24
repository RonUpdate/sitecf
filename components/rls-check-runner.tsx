"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function RLSCheckRunner() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const runRLSCheck = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/rls-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при запуске проверки RLS")
      }

      toast({
        title: "Проверка выполнена",
        description: `Проверено ${data.results?.length || 0} таблиц`,
        variant: "default",
      })

      // Обновляем страницу для отображения новых результатов
      router.refresh()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при запуске проверки",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={runRLSCheck} disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Выполняется...
        </>
      ) : (
        "Запустить проверку"
      )}
    </Button>
  )
}
