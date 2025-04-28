"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Tag,
  Package,
  Settings,
  LogOut,
  Users,
  ImageIcon,
  BookOpen,
  FileCode,
  AlertCircle,
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const menuItems = [
    { name: "Панель управления", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Категории", path: "/admin/categories", icon: <Tag className="h-5 w-5" /> },
    { name: "Продукты", path: "/admin/products", icon: <Package className="h-5 w-5" /> },
    { name: "Раскраски", path: "/admin/coloring-pages", icon: <ImageIcon className="h-5 w-5" /> },
    { name: "Блог", path: "/admin/blog", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Категории блога", path: "/admin/blog/categories", icon: <FileText className="h-5 w-5" /> },
    { name: "Теги блога", path: "/admin/blog/tags", icon: <Tag className="h-5 w-5" /> },
    { name: "Пользователи", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
    { name: "Профиль", path: "/admin/profile", icon: <Settings className="h-5 w-5" /> },
    { name: "Логи аутентификации", path: "/admin/auth-logs", icon: <FileCode className="h-5 w-5" /> },
    { name: "Отладка", path: "/admin/debug", icon: <AlertCircle className="h-5 w-5" /> },
  ]

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="text-xl font-bold mb-6 pb-4 border-b border-gray-700">Админ-панель</div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive(item.path) ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
          <li className="pt-4 mt-4 border-t border-gray-700">
            <a
              href="/api/auth/logout"
              className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Выйти</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
