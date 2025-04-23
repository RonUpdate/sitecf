"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { requireAuth, requireAdmin } from "@/lib/auth-utils"
import type { Database } from "@/types/supabase"

export async function createCategory(formData: FormData) {
  try {
    // Проверяем, что пользователь является администратором
    await requireAdmin()

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

export async function downloadColoringPage(formData: FormData) {
  try {
    // Проверяем, что пользователь авторизован
    await requireAuth()

    const supabase = createServerActionClient<Database>({ cookies })
    const pageId = formData.get("id") as string

    // Получение данных страницы
    const { data: page } = await supabase.from("coloring_pages").select("*").eq("id", pageId).single()

    if (!page) {
      return { error: "Страница не найдена" }
    }

    // Увеличение счетчика загрузок
    await supabase
      .from("coloring_pages")
      .update({ download_count: (page.download_count || 0) + 1 })
      .eq("id", pageId)

    return { url: page.image_url }
  } catch (error: any) {
    // Ошибки unauthorized() и forbidden() будут автоматически обработаны
    return { error: error.message }
  }
}
