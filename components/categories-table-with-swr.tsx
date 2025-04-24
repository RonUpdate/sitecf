"use client"

import { useAuthenticatedSWR } from "@/hooks/use-swr-fetch"
import { CategoryTable } from "@/components/category-table"
import { Skeleton } from "@/components/ui/skeleton"

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export function CategoriesTableWithSWR() {
  const { data, error, isLoading, mutate } = useAuthenticatedSWR<{ categories: Category[] }>("/api/categories")

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-800 p-4">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t p-4">
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Error loading categories</p>
        <button onClick={() => mutate()} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md">
          Try Again
        </button>
      </div>
    )
  }

  return <CategoryTable categories={data?.categories || []} />
}
