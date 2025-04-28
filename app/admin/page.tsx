import Link from "next/link"
import LogoutButton from "@/components/logout-button"

export default function AdminHomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Товары</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/products" className="text-blue-600 hover:underline">
                Управление товарами
              </Link>
            </li>
            <li>
              <Link href="/admin/products/new" className="text-blue-600 hover:underline">
                Добавить новый товар
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Категории</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/categories" className="text-blue-600 hover:underline">
                Управление категориями
              </Link>
            </li>
            <li>
              <Link href="/admin/categories/new" className="text-blue-600 hover:underline">
                Добавить новую категорию
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Блог</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/blog" className="text-blue-600 hover:underline">
                Управление постами
              </Link>
            </li>
            <li>
              <Link href="/admin/blog/new" className="text-blue-600 hover:underline">
                Добавить новый пост
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/users" className="text-blue-600 hover:underline">
                Управление пользователями
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <LogoutButton />
    </div>
  )
}
