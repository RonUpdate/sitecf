import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { TagsStatistics } from "@/components/tags-statistics"
import { TagsManagement } from "@/components/tags-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

export default async function TagsDashboardPage() {
  // Код страницы...
  const supabase = createServerComponentClient({ cookies })

  // Получаем все теги
  const { data: tags, error: tagsError } = await supabase
    .from("blog_tags")
    .select("*")
    .order("name", { ascending: true })

  // Получаем статистику использования тегов
  const { data: tagsStats, error: statsError } = await supabase
    .rpc("get_tags_usage_statistics")
    .returns<Array<{ tag_id: string; tag_name: string; post_count: number }>>()
    .maybeSingle()

  // Обрабатываем ошибки
  if (tagsError || statsError) {
    console.error("Error fetching tags data:", tagsError || statsError)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Управление тегами блога</h1>

      <Tabs defaultValue="management" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="management">Управление тегами</TabsTrigger>
          <TabsTrigger value="statistics">Статистика использования</TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <TagsManagement initialTags={tags || []} />
        </TabsContent>

        <TabsContent value="statistics">
          <TagsStatistics tagsStats={tagsStats || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
