"use client"

import type React from "react"
import { useState } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Home, ImageIcon, LayoutDashboard, Package, Tag, Trash2, Users, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AdminLogoutButton } from "@/components/admin-logout-button"
import { Input } from "@/components/ui/input"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const navItems = [
    {
      title: "Панель управления",
      href: "/admin",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Товары",
      href: "/admin/products",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      title: "Категории",
      href: "/admin/categories",
      icon: <Tag className="mr-2 h-4 w-4" />,
    },
    {
      title: "Раскраски",
      href: "/admin/coloring-pages",
      icon: <ImageIcon className="mr-2 h-4 w-4" />,
    },
    {
      title: "Блог",
      href: "/admin/blog",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Пользователи",
      href: "/admin/users",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
  ]

  const utilityItems = [
    {
      title: "Очистка данных",
      href: "/admin/data-cleanup",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Просмотр сайта",
      href: "/",
      icon: <Home className="mr-2 h-4 w-4" />,
      external: true,
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">Админ-панель</h2>

          {/* Навигационные пункты перемещены выше поиска */}
          <div className="space-y-1 mb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>

          {/* Поиск сделан менее заметным */}
          <div className="px-2 mb-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-8 text-xs bg-transparent border-gray-200"
              />
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Утилиты</h2>
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              {utilityItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <AdminLogoutButton />
        </div>
      </div>
    </div>
  )
}
