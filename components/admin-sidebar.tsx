"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  FileText,
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  Search,
  Settings,
  ShoppingCart,
  User,
  Users,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { AdminLogoutButton } from "@/components/admin-logout-button"
import { Package2 } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="flex h-screen flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="">Admin Panel</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin") && !isActive("/admin/blog") && !isActive("/admin/products")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/products")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/admin/categories"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/categories")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <FolderTree className="h-4 w-4" />
            Categories
          </Link>
          <Link
            href="/admin/coloring-pages"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/coloring-pages")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <ImageIcon className="h-4 w-4" />
            Coloring Pages
          </Link>
          <Link
            href="/admin/blog"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive("/admin/blog")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <BookOpen className="h-4 w-4" />
            Blog
          </Link>

          <div className="mt-4 mb-4">
            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight text-muted-foreground">Utilities</p>
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive("/admin/settings")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/admin/users"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive("/admin/users")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="/admin/profile"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive("/admin/profile")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/admin/auth-logs"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive("/admin/auth-logs")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <FileText className="h-4 w-4" />
              Auth Logs
            </Link>
            <Link
              href="/admin/data-cleanup"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive("/admin/data-cleanup")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Data Cleanup
            </Link>
          </div>
        </nav>

        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-transparent pl-8 text-xs h-8 border-gray-200"
            />
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <AdminLogoutButton />
      </div>
    </div>
  )
}
