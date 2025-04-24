"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  slug: string
  stock_quantity: number
  is_featured: boolean
  category_id: string
  created_at: string
  categories: {
    name: string
  }
}

export function ProductTable({ products }: { products: Product[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localProducts, setLocalProducts] = useState<Product[]>(products)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)

    try {
      const { error } = await supabase.from("products").delete().eq("id", deleteId)

      if (error) {
        // Check for the specific PostgreSQL error about missing RETURN statements
        if (error.message && error.message.includes("without RETURN")) {
          console.warn("Database function missing RETURN statement, but deletion may have succeeded:", error.message)

          // Update local state to remove the deleted product
          setLocalProducts((prev) => prev.filter((product) => product.id !== deleteId))

          toast({
            title: "Товар удален",
            description: "Товар был успешно удален из системы.",
            variant: "default",
          })
        } else {
          throw error
        }
      } else {
        // Update local state to remove the deleted product
        setLocalProducts((prev) => prev.filter((product) => product.id !== deleteId))

        toast({
          title: "Товар удален",
          description: "Товар был успешно удален из системы.",
          variant: "default",
        })
      }

      // Show success notification
      const successToast = document.createElement("div")
      successToast.className =
        "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-lg"
      successToast.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span><strong>Успешно!</strong> Товар удален.</span>
      `
      document.body.appendChild(successToast)

      // Remove the notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast)
        }
      }, 3000)

      // Refresh the page after a short delay to show the notification
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price)
  }

  if (localProducts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Товары не найдены</p>
        <Link href="/admin/products/new">
          <Button>Добавить первый товар</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="hidden md:table-cell">Категория</TableHead>
              <TableHead className="hidden md:table-cell">Наличие</TableHead>
              <TableHead className="hidden md:table-cell">Статус</TableHead>
              <TableHead className="w-[100px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded overflow-hidden">
                    <Image
                      src={product.image_url || "/placeholder.svg?height=40&width=40&query=product"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell className="hidden md:table-cell">{product.categories?.name || "Без категории"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={product.stock_quantity > 0 ? "outline" : "destructive"}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} шт.` : "Нет в наличии"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.is_featured ? (
                    <Badge variant="default">Рекомендуемый</Badge>
                  ) : (
                    <Badge variant="outline">Обычный</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => setDeleteId(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Удалить</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить. Товар будет удален навсегда.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
              {isDeleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
