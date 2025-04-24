"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type BaseItem = {
  id: string
  slug: string
  price: number
  image_url: string
  description: string
  is_featured: boolean
  category_id: string
  categories?: {
    name: string
    slug: string
  }
}

type Product = BaseItem & {
  name: string
  stock_quantity: number
}

type ColoringPage = BaseItem & {
  title: string
  thumbnail_url: string
  difficulty_level: string
  age_group: string
  download_count: number
}

type UnifiedItemDetailProps = {
  item: Product | ColoringPage
  type: "product" | "coloringPage"
}

export function UnifiedItemDetail({ item, type }: UnifiedItemDetailProps) {
  const isProduct = type === "product"
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price)
  }

  const handleDownload = async () => {
    if (!isProduct) {
      setIsDownloading(true)
      try {
        // In a real app, you would implement the download logic here
        // For now, we'll just simulate a download
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Скачивание начато",
          description: "Файл раскраски скоро начнет загружаться.",
        })

        // Redirect to the image URL to download it
        window.open((item as ColoringPage).image_url, "_blank")
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось скачать файл. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        })
      } finally {
        setIsDownloading(false)
      }
    }
  }

  const name = isProduct ? (item as Product).name : (item as ColoringPage).title

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {item.categories && (
        <Link href={`/category/${item.categories.slug}`} className="flex items-center text-sm mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к {item.categories.name}
        </Link>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={
              isProduct
                ? item.image_url || "/placeholder.svg?height=600&width=600&query=product"
                : (item as ColoringPage).image_url || "/placeholder.svg?height=600&width=600&query=coloring+page"
            }
            alt={name}
            fill
            className="object-contain"
            priority
          />
          {item.is_featured && (
            <div className="absolute top-4 left-4">
              <Badge className="flex items-center gap-1 bg-primary">
                <Star className="h-3 w-3" />
                Рекомендуемый
              </Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{name}</h1>

          {!isProduct && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{(item as ColoringPage).difficulty_level}</Badge>
              <Badge variant="outline">{(item as ColoringPage).age_group}</Badge>
              {item.categories && <Badge variant="outline">{item.categories.name}</Badge>}
            </div>
          )}

          <div className="mt-4">
            <span className="text-3xl font-bold text-primary">{formatPrice(item.price)}</span>
          </div>

          {isProduct && (
            <div className="mt-4">
              {(item as Product).stock_quantity > 0 ? (
                <Badge variant="outline" className="bg-green-50">
                  {(item as Product).stock_quantity} в наличии
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50">
                  Нет в наличии
                </Badge>
              )}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Описание</h3>
            <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
          </div>

          <div className="mt-8">
            {isProduct ? (
              <Button
                className="w-full md:w-auto"
                disabled={(item as Product).stock_quantity <= 0}
                onClick={() => {
                  toast({
                    title: "Товар добавлен в корзину",
                    description: "Товар успешно добавлен в корзину.",
                  })
                }}
              >
                Добавить в корзину
              </Button>
            ) : (
              <>
                <Button className="w-full md:w-auto gap-2" size="lg" onClick={handleDownload} disabled={isDownloading}>
                  <Download className="h-5 w-5" />
                  {isDownloading ? "Скачивание..." : "Скачать сейчас"}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  <Download className="h-3 w-3 inline mr-1" />
                  {(item as ColoringPage).download_count || 0} загрузок
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
