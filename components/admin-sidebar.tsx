"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Layers,
  LayoutDashboard,
  LogOut,
  FileImage,
  Palette,
  User,
  AlertTriangle,
  FileText,
  FolderTree,
  Tag,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        setError(false)

        const { data, error } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        if (data.user) {
          setUserEmail(data.user.email)
        } else {
          // Only redirect if we're sure the user isn't authenticated
          // and we're not already loading
          if (!loading) {
            router.push("/login")
          }
        }
      } catch (error) {
        console.error("Error getting user:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Устанавливаем слушатель изменения состояния авторизации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserEmail(session.user.email)
      } else if (event === "SIGNED_OUT") {
        setUserEmail(null)
        // Перенаправляем на главную страницу после выхода
        router.push("/")
      }
    })

    // Очищаем подписку при размонтировании компонента
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      // Перенаправление обрабатывается слушателем изменения состояния авторизации
    } catch (error) {
      console.error("Error signing out:", error)
      // Показываем ошибку пользователю
      alert("Ошибка при выходе из системы. Пожалуйста, попробуйте еще раз.")
    }
  }

  const links = [
    {
      name: "Панель управления",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
    },
    {
      name: "Категории",
      href: "/admin/categories",
      icon: <Layers className="w-5 h-5 mr-3" />,
    },
    {
      name: "Страницы раскраски",
      href: "/admin/coloring-pages",
      icon: <FileImage className="w-5 h-5 mr-3" />,
    },
    {
      name: "Блог",
      href: "/admin/blog",
      icon: <FileText className="w-5 h-5 mr-3" />,
    },
    {
      name: "Категории блога",
      href: "/admin/blog/categories",
      icon: <FolderTree className="w-5 h-5 mr-3" />,
    },
    {
      name: "Теги блога",
      href: "/admin/blog/tags",
      icon: <Tag className="w-5 h-5 mr-3" />,
    },
  ]

  if (loading) {
    return (
      <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
        <p className="text-center mb-4">Ошибка загрузки данных</p>
        <Button onClick={() => window.location.reload()} size="sm">
          Обновить страницу
        </Button>
      </div>
    )
  }

  return (
    <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">Art Market</span>
        </Link>
        <p className="text-xs text-gray-500 mt-1">Панель администратора</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", pathname === link.href && "bg-primary/10 text-primary")}
                >
                  {link.icon}
                  {link.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t dark:border-gray-800 space-y-2">
        {userEmail && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="truncate">{userEmail}</span>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleSignOut}>
          <LogOut className="w-5 h-5 mr-3" />
          Выйти
        </Button>
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Palette className="w-5 h-5 mr-3" />
            Вернуться на сайт
          </Button>
        </Link>
      </div>
    </div>
  )
}
