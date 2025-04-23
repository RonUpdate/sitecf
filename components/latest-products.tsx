"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Skeleton } from "@/components/ui/skeleton"

type Product = {
  id: string
  name: string
  price: number
  image_url: string
  slug: string
  stock_quantity: number
  is_featured: boolean
  created_at: string
}

export function LatestProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchLatestProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6)

        if (error) {
          console.error("Error fetching products:", error)
          return
        }

        setProducts(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestProducts()
  }, [supabase])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No products found. Add some in the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Link href={`/product/${product.slug}`} key={product.id}>
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="relative h-48 w-full">
              <Image
                src={product.image_url || "/placeholder.svg?height=192&width=384&query=product"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.is_featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-lg font-bold mt-2">{formatPrice(product.price)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              {product.stock_quantity > 0 ? (
                <Badge variant="outline" className="bg-green-50">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50">
                  Out of Stock
                </Badge>
              )}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
