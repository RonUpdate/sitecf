"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  const supabase = createServerClient()

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price"))
  const stock_quantity = Number(formData.get("stock_quantity"))
  const category_id = formData.get("category_id") as string
  const image_url = formData.get("image_url") as string

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    description,
    price,
    stock_quantity,
    category_id,
    image_url,
    featured: false,
    is_featured: false,
  })

  if (error) {
    console.error("Ошибка при сохранении товара:", error)
    throw new Error(error.message)
  }

  revalidatePath("/admin/products")
}
