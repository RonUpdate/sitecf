"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Skeleton } from "@/components/ui/skeleton"
import { ColoringPageModal } from "@/components/coloring-page-modal"

type ColoringPage = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  thumbnail_url: string
  slug: string
  difficulty_level: string
  age_group: string
  is_featured: boolean
  download_count: number
  created_at: string
  categories?: {
    name: string
    slug: string
  }
}

export function FeaturedColoringPages() {
  const [coloringPages, setColoringPages] = useState<ColoringPage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchFeaturedPages() {
      try {
        const { data, error } = await supabase
          .from("coloring_pages")
          .select(`
            *,
            categories:category_id (
              name,
              slug
            )
          `)
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(6)

        if (error) {
          console.error("Error fetching coloring pages:", error)
          return
        }

        setColoringPages(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPages()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (coloringPages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No featured coloring pages found. Add some in the admin panel.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {coloringPages.map((page) => (
        <ColoringPageModal key={page.id} page={page} />
      ))}
    </div>
  )
}
