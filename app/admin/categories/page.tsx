"use client"

import { useEffect, useState } from "react"
import { CategoryTable } from "@/components/category-table"
import { AdminFilterBar } from "@/components/admin-filter-bar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState<{ query?: string }>({})

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClientComponentClient<Database>()

      // Build query
      let query = supabase.from("categories").select("*").order("created_at", { ascending: false })

      // Apply search if provided
      if (searchParams.query) {
        query = query.or(`name.ilike.%${searchParams.query}%,description.ilike.%${searchParams.query}%`)
      }

      const { data } = await query
      setCategories(data || [])
      setLoading(false)
    }

    fetchCategories()
  }, [searchParams.query])

  const sortOptions = [
    { id: "name", label: "Название" },
    { id: "created_at", label: "Дата создания" },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить категорию
          </Button>
        </Link>
      </div>

      <AdminFilterBar
        title="Категории"
        sortOptions={sortOptions}
        onSearch={(query) => {
          setSearchParams({ query })
        }}
        onFilter={(filters) => {}}
        onSort={(sort) => {}}
      />

      {loading ? (
        <Skeleton className="h-[500px] w-full" />
      ) : categories && categories.length > 0 ? (
        <CategoryTable categories={categories} />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Категории не найдены</p>
          <Link href="/admin/categories/new">
            <Button>Добавить первую категорию</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
