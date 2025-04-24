"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import logger from "@/lib/logger"

export async function deleteTestProducts() {
  try {
    const supabase = await createServerSupabaseClient()

    // Удаляем все продукты без исключений
    const { error } = await supabase.from("products").delete().eq("TRUE", "TRUE")

    if (error) {
      logger.error("Ошибка при удалении продуктов", { error: error.message })
      throw new Error(`Ошибка при удалении продуктов: ${error.message}`)
    }

    logger.info("Все продукты успешно удалены")

    // Обновляем кеш страницы
    revalidatePath("/admin/products")
    revalidatePath("/admin/data-cleanup")
    revalidatePath("/")
    revalidatePath("/featured")

    return { success: true }
  } catch (error: any) {
    logger.error("Непредвиденная ошибка при удалении продуктов", { error: error.message })
    return { success: false, error: error.message }
  }
}

export async function deleteAllColoringPages() {
  try {
    const supabase = await createServerSupabaseClient()

    // Удаляем все страницы раскрасок без исключений
    const { error } = await supabase.from("coloring_pages").delete().eq("TRUE", "TRUE")

    if (error) {
      logger.error("Ошибка при удалении страниц раскрасок", { error: error.message })
      throw new Error(`Ошибка при удалении страниц раскрасок: ${error.message}`)
    }

    logger.info("Все страницы раскрасок успешно удалены")

    // Обновляем кеш страницы
    revalidatePath("/admin/coloring-pages")
    revalidatePath("/admin/data-cleanup")
    revalidatePath("/")
    revalidatePath("/featured")

    return { success: true }
  } catch (error: any) {
    logger.error("Непредвиденная ошибка при удалении страниц раскрасок", { error: error.message })
    return { success: false, error: error.message }
  }
}
