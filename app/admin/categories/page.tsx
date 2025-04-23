import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CategoryTable } from "@/components/category-table"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/auth-utils"
import type { Database } from "@/types/supabase"

export default async function CategoriesPage() {
  // Проверяем, что пользователь является администратором
  await requireAdmin()

  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Категории</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить категорию
          </Button>
        </Link>
      </div>

      <CategoryTable categories={categories || []} />
    </div>
  )
}
