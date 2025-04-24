"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertTriangle, X } from "lucide-react"

type NotificationType = "success" | "error" | "warning" | "info"

interface ActionNotificationProps {
  type: NotificationType
  title: string
  message: string
  duration?: number
  onClose?: () => void
}

export function ActionNotification({
  type = "success",
  title,
  message,
  duration = 5000,
  onClose,
}: ActionNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-green-50 border-green-200"
    }
  }

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800"
      case "error":
        return "text-red-800"
      case "warning":
        return "text-yellow-800"
      case "info":
        return "text-blue-800"
      default:
        return "text-green-800"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg border ${getBackgroundColor()} ${getTextColor()} max-w-md animate-in slide-in-from-right-5`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-1 text-sm opacity-90">{message}</div>
        </div>
        <button
          type="button"
          className={`ml-3 flex-shrink-0 ${getTextColor()} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500 rounded-md`}
          onClick={handleClose}
        >
          <span className="sr-only">Закрыть</span>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
