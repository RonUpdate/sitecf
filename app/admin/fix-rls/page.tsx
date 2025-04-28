import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fixBlogPostsTagsRLS, checkRLSStatus } from "./actions"
import logger from "@/lib/logger"

export default async function FixRLSPage() {
  const supabase = await createServerSupabaseClient()

  // Проверяем текущий статус RLS для таблицы blog_posts_tags
  const { data: rlsStatus, error: rlsError } = await supabase
    .from("pg_tables")
    .select("tablename, rowsecurity")
    .eq("schemaname", "public")
    .eq("tablename", "blog_posts_tags")
    .single()

  if (rlsError) {
    logger.error("Ошибка при проверке статуса RLS", { error: rlsError.message })
  }

  // Проверяем существующие политики RLS
  const { data: rlsPolicies, error: policiesError } = await supabase.rpc("check_rls_policies", {
    table_name: "blog_posts_tags",
  })

  if (policiesError) {
    logger.error("Ошибка при проверке политик RLS", { error: policiesError.message })
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Исправление настроек RLS</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Таблица blog_posts_tags</CardTitle>
            <CardDescription>
              Управление настройками Row Level Security (RLS) для таблицы blog_posts_tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Текущий статус:</h3>
              {rlsError ? (
                <p className="text-red-500">Ошибка при проверке статуса RLS: {rlsError.message}</p>
              ) : (
                <p>
                  RLS для таблицы blog_posts_tags:
                  <span className={rlsStatus?.rowsecurity ? "text-green-500 font-bold" : "text-gray-500"}>
                    {rlsStatus?.rowsecurity ? " Включено" : " Отключено"}
                  </span>
                </p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium">Политики RLS:</h3>
              {policiesError ? (
                <p className="text-red-500">Ошибка при проверке политик RLS: {policiesError.message}</p>
              ) : rlsPolicies && rlsPolicies.length > 0 ? (
                <ul className="list-disc pl-5">
                  {rlsPolicies.map((policy: any, index: number) => (
                    <li key={index}>
                      {policy.policyname}: {policy.cmd} - {policy.qual}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-yellow-500">Для таблицы blog_posts_tags не определены политики RLS.</p>
              )}
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <p className="text-yellow-600 dark:text-yellow-400">
                <strong>Проблема:</strong> Для таблицы blog_posts_tags включена защита на уровне строк (RLS), но не
                определены политики доступа. Это означает, что таблица фактически недоступна для всех пользователей,
                кроме владельца таблицы.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Варианты исправления:</h3>
              <div className="flex flex-wrap gap-4">
                <form action={fixBlogPostsTagsRLS}>
                  <input type="hidden" name="action" value="disable" />
                  <Button type="submit" variant="default">
                    Отключить RLS
                  </Button>
                </form>

                <form action={fixBlogPostsTagsRLS}>
                  <input type="hidden" name="action" value="create_all_access" />
                  <Button type="submit" variant="outline">
                    Создать политику доступа для всех
                  </Button>
                </form>

                <form action={fixBlogPostsTagsRLS}>
                  <input type="hidden" name="action" value="create_admin_access" />
                  <Button type="submit" variant="outline">
                    Создать политику доступа для админов
                  </Button>
                </form>
              </div>
            </div>

            <form action={checkRLSStatus}>
              <Button type="submit" variant="secondary">
                Проверить текущий статус
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
