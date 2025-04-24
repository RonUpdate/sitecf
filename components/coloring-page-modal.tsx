"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Download, Star, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

export function ColoringPageModal({ page }: { page: ColoringPage }) {
  const [isOpen, setIsOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <>
      <div className="cursor-pointer group" onClick={() => setIsOpen(true)}>
        <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
          <Image
            src={page.thumbnail_url || page.image_url || "/placeholder.svg?height=256&width=256&query=coloring+page"}
            alt={page.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">{page.age_group}</Badge>
          </div>
        </div>
        <div className="p-4 border border-t-0 rounded-b-lg">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{page.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm mt-1">{page.description}</p>
          <div className="flex justify-between items-center mt-2">
            <Badge variant="outline">{page.difficulty_level}</Badge>
            <span className="font-bold text-primary">{formatPrice(page.price)}</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="relative h-64 sm:h-80 w-full">
                <Image
                  src={page.image_url || "/placeholder.svg?height=320&width=640&query=coloring+page"}
                  alt={page.title}
                  fill
                  className="object-contain"
                />
                {page.is_featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="flex items-center gap-1 bg-primary">
                      <Star className="h-3 w-3" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{page.title}</h2>
              <p className="text-xl font-bold text-primary mb-4">{formatPrice(page.price)}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{page.difficulty_level}</Badge>
                <Badge variant="outline">{page.age_group}</Badge>
                {page.categories && <Badge variant="outline">{page.categories.name}</Badge>}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300">{page.description}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  <Download className="h-3 w-3 inline mr-1" />
                  {page.download_count || 0} downloads
                </p>

                <Link href={`/coloring-page/${page.slug}`}>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                    size="lg"
                  >
                    Download Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
