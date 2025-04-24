import { UnifiedItemTable } from "@/components/unified-item-table"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { TableExistenceChecker } from "@/components/table-existence-checker"

export default async function ColoringPagesPage() {
  const supabase = await createServerSupabaseClient()

  // Get coloring pages with category information
  const { data: coloringPages } = await supabase
    .from("coloring_pages")
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Страницы раскраски</h1>
      </div>

      <div className="mb-6">
        <TableExistenceChecker />
      </div>

      <UnifiedItemTable
        type="coloringPage"
        initialItems={coloringPages || []}
        addNewUrl="/admin/coloring-pages/create"
        addNewLabel="Добавить страницу"
      />
    </div>
  )
}
