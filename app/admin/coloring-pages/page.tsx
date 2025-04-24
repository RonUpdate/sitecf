"use client"

import { Suspense } from "react"
import { AdminFilterBar } from "@/components/admin-filter-bar"
import { ColoringPagesTable } from "@/components/coloring-pages-table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export default async function ColoringPagesPage({ searchParams }: { searchParams: { query?: string } }) {
  const supabase = await createServerSupabaseClient()

  // Fetch categories for filter options
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")
    .catch(() => ({ data: [] }))

  const filterOptions = [
    {
      id: "category_id",
      label: "Категория",
      type: "select",
      options: categories?.map((cat) => ({ value: cat.id, label: cat.name })) || [],
    },
    {
      id: "is_featured",
      label: "Избранное",
      type: "boolean",
    },
    {
      id: "age_group",
      label: "Возрастная группа",
      type: "select",
      options: [
        { value: "children", label: "Дети" },
        { value: "adults", label: "Взрослые" },
        { value: "all", label: "Все возрасты" },
      ],
    },
    {
      id: "difficulty_level",
      label: "Сложность",
      type: "select",
      options: [
        { value: "easy", label: "Легкая" },
        { value: "medium", label: "Средняя" },
        { value: "hard", label: "Сложная" },
      ],
    },
  ]

  const sortOptions = [
    { id: "title", label: "Название" },
    { id: "price", label: "Цена" },
    { id: "download_count", label: "Загрузки" },
    { id: "created_at", label: "Дата создания" },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Раскраски</h1>
        <Link href="/admin/coloring-pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить раскраску
          </Button>
        </Link>
      </div>

      <AdminFilterBar
        title="Раскраски"
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        onSearch={(query) => {}}
        onFilter={(filters) => {}}
        onSort={(sort) => {}}
      />

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <ColoringPagesTable />
      </Suspense>
    </div>
  )
}
