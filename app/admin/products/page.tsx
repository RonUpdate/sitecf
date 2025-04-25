"use client"

import { useEffect, useState } from "react"
import { UnifiedItemTable } from "@/components/unified-item-table"
import { AdminFilterBar } from "@/components/admin-filter-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export default function ProductsPage({ searchParams }: { searchParams: { query?: string } }) {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClientComponentClient<Database>()

      // Fetch all products with category information
      let query = supabase
        .from("products")
        .select(`
          *,
          categories:category_id (
            name
          )
        `)
        .order("created_at", { ascending: false })

      // Apply search if provided
      if (searchParams.query) {
        query = query.ilike("name", `%${searchParams.query}%`)
      }

      const { data: productsData } = await query
      setProducts(productsData || [])

      // Fetch categories for filter options
      const { data: categoriesData } = await supabase.from("categories").select("id, name").order("name")
      setCategories(categoriesData || [])

      setLoading(false)
    }

    fetchData()
  }, [searchParams.query])

  const filterOptions = [
    {
      id: "category_id",
      label: "Категория",
      type: "select",
      options: categories?.map((cat) => ({ value: cat.id, label: cat.name })) || [],
    },
    {
      id: "is_featured",
      label: "Рекомендуемый",
      type: "boolean",
    },
    {
      id: "stock_quantity",
      label: "Наличие",
      type: "select",
      options: [
        { value: "in_stock", label: "В наличии" },
        { value: "out_of_stock", label: "Нет в наличии" },
      ],
    },
  ]

  const sortOptions = [
    { id: "name", label: "Название" },
    { id: "price", label: "Цена" },
    { id: "created_at", label: "Дата создания" },
  ]

  return (
    <div>
      <AdminFilterBar
        title="Товары"
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        onSearch={(query) => {}}
        onFilter={(filters) => {}}
        onSort={(sort) => {}}
      />

      {loading ? (
        <Skeleton className="h-[500px] w-full" />
      ) : (
        <UnifiedItemTable
          type="product"
          initialItems={products}
          addNewUrl="/admin/products/new"
          addNewLabel="Добавить товар"
        />
      )}
    </div>
  )
}
