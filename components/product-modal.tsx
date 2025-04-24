"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

type Product = {
  id: string
  name: string
  price: number
  description?: string
  image_url: string
  slug: string
  stock_quantity: number
  is_featured: boolean
}

export function ProductModal({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price)
  }

  return (
    <>
      <div className="cursor-pointer group" onClick={() => setIsOpen(true)}>
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={product.image_url || "/placeholder.svg?height=192&width=384&query=product"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.is_featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
        </div>
        <div className="p-4 border border-t-0 rounded-b-lg">
          <h3 className="font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-lg font-bold mt-2">{formatPrice(product.price)}</p>
          <div className="mt-2">
            {product.stock_quantity > 0 ? (
              <Badge variant="outline" className="bg-green-50">
                In Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
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
                    src={product.image_url || "/placeholder.svg?height=320&width=640&query=product"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.is_featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary">Featured</Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-xl font-bold text-primary mb-4">{formatPrice(product.price)}</p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {product.description || "No description available for this product."}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    {product.stock_quantity > 0 ? (
                      <Badge variant="outline" className="bg-green-50">
                        {product.stock_quantity} in stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <Link href={`/product/${product.slug}`}>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100"
                      size="lg"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
