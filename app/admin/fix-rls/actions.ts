"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import logger from "@/lib/logger"

export async function fixBlogPostsTagsRLS(formData: FormData) {
  try {
    const action = formData.get("action") as string
    const supabase = await createServerSupabaseClient()

    let query = ""

    switch (action) {
      case "disable":
        query = `ALTER TABLE public.blog_posts_tags DISABLE ROW LEVEL SECURITY;`
        break
      case "create_all_access":
        query = `
          ALTER TABLE public.blog_posts_tags ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS blog_posts_tags_all_access ON public.blog_posts_tags;
          CREATE POLICY blog_posts_tags_all_access ON public.blog_posts_tags
            USING (true)
            WITH CHECK (true);
        `
        break
      case "create_admin_access":
        query = `
          ALTER TABLE public.blog_posts_tags ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS blog_posts_tags_admin_access ON public.blog_posts_tags;
          CREATE POLICY blog_posts_tags_admin_access ON public.blog_posts_tags
            USING (is_admin(auth.uid()))
            WITH CHECK (is_admin(auth.uid()));
        `
        break
      default:
        throw new Error(`Неизвестное действие: ${action}`)
    }

    const { error } = await supabase.rpc("execute_sql", { sql_query: query })

    if (error) {
      logger.error(`Ошибка при выполнении действия ${action} для RLS`, { error: error.message })
      throw new Error(`Ошибка при выполнении SQL: ${error.message}`)
    }

    logger.info(`Успешно выполнено действие ${action} для RLS таблицы blog_posts_tags`)

    revalidatePath("/admin/fix-rls")
    return { success: true, action }
  } catch (error: any) {
    logger.error("Непредвиденная ошибка при исправлении RLS", { error: error.message })
    return { success: false, error: error.message }
  }
}

export async function checkRLSStatus() {
  try {
    revalidatePath("/admin/fix-rls")
    return { success: true }
  } catch (error: any) {
    logger.error("Ошибка при обновлении статуса RLS", { error: error.message })
    return { success: false, error: error.message }
  }
}
