"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import logger from "@/lib/logger"

export async function deleteTestProducts() {
  try {
    const supabase = await createServerSupabaseClient()

    // Удаляем все продукты
    const { error } = await supabase.from("products").delete().neq("id", "0")

    if (error) {
      logger.error("Ошибка при удалении продуктов", { error: error.message })
      throw new Error(`Ошибка при удалении продуктов: ${error.message}`)
    }

    logger.info("Все продукты успешно удалены")

    // Обновляем кеш страницы
    revalidatePath("/admin/products")
    revalidatePath("/admin/data-cleanup")
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    logger.error("Непредвиденная ошибка при удалении продуктов", { error: error.message })
    return { success: false, error: error.message }
  }
}
