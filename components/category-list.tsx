"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Category = {
  id: string
  name: string
  slug: string
}

interface CategoryListProps {
  categories: Category[]
  activeCategory?: string
}

export function CategoryList({ categories, activeCategory }: CategoryListProps) {
  if (!categories || categories.length === 0) {
    return <p className="text-center text-gray-500">No categories available.</p>
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Link href="/featured">
        <Button
          variant={!activeCategory ? "default" : "outline"}
          className={cn("rounded-full px-4 py-2", !activeCategory && "bg-primary text-primary-foreground")}
        >
          Все
        </Button>
      </Link>

      {categories.map((category) => (
        <Link href={`/category/${category.slug}`} key={category.id}>
          <Button
            variant={activeCategory === category.slug ? "default" : "outline"}
            className={cn(
              "rounded-full px-4 py-2",
              activeCategory === category.slug && "bg-primary text-primary-foreground",
            )}
          >
            {category.name}
          </Button>
        </Link>
      ))}
    </div>
  )
}
