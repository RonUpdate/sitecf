"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { checkPermission } from "@/lib/permissions"
import type { Database } from "@/types/supabase"

export async function createCategory(formData: FormData) {
  try {
    // Проверяем разрешение на создание категории
    await checkPermission("canCreateCategory")

    const supabase = createServerActionClient<Database>({ cookies })

    const { error } = await supabase.from("categories").insert({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      slug: formData.get("slug") as string,
      image_url: formData.get("image_url") as string,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/categories")
    revalidatePath("/categories")

    return { success: true }
  } catch (error: any) {
    // Ошибки unauthorized() и forbidden() будут автоматически обработаны
    return { error: error.message }
  }
}

export async function updateCategory(formData: FormData) {
  try {
    // Проверяем разрешение на редактирование категории
    await checkPermission("canEditCategory")

    const supabase = createServerActionClient<Database>({ cookies })
    const categoryId = formData.get("id") as string

    const { error } = await supabase
      .from("categories")
      .update({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        slug: formData.get("slug") as string,
        image_url: formData.get("image_url") as string,
      })
      .eq("id", categoryId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/categories")
    revalidatePath(`/category/${formData.get("slug")}`)

    return { success: true }
  } catch (error: any) {
    // Ошибки unauthorized() и forbidden() будут автоматически обработаны
    return { error: error.message }
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    // Проверяем разрешение на удаление категории
    await checkPermission("canDeleteCategory")

    const supabase = createServerActionClient<Database>({ cookies })
    const categoryId = formData.get("id") as string

    const { error } = await supabase.from("categories").delete().eq("id", categoryId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin/categories")
    revalidatePath("/categories")

    return { success: true }
  } catch (error: any) {
    // Ошибки unauthorized() и forbidden() будут автоматически обработаны
    return { error: error.message }
  }
}
