// Проверяем и удаляем любые экспорты метаданных
import type React from "react"
// Удаляем импорт generateMetadata или Metadata, если они есть

export default function TagsDashboardLayout({ children }: { children: React.ReactNode }) {
  // Код макета...
  return <div>{children}</div>
}
