import { createServerClient } from "@/lib/supabase/server-client"
import Link from "next/link"

export default async function AdminCategoriesPage() {
  const supabase = createServerClient()
  const { data: categories } = await supabase.from("categories").select("*")

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Link href="/admin/categories/new" className="px-4 py-2 bg-blue-600 text-white rounded">
          Добавить категорию
        </Link>
      </div>

      {categories && categories.length > 0 ? (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.id} className="p-4 border rounded">
              <div className="font-bold">{category.name}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет категорий.</p>
      )}
    </div>
  )
}
