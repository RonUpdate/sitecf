import { notFound, redirect } from "next/navigation"
import { ColoringPageForm } from "@/components/coloring-page-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function EditColoringPagePage({
  params,
}: {
  params: { id: string }
}) {
  // Если id равно "new", перенаправляем на страницу создания новой страницы
  if (params.id === "new") {
    redirect("/admin/coloring-pages/new")
  }

  try {
    const supabase = createServerComponentClient({ cookies })

    // Проверяем, что id является валидным UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(params.id)) {
      console.error("Invalid UUID format:", params.id)
      notFound()
    }

    const { data: coloringPage, error } = await supabase.from("coloring_pages").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching coloring page:", error)
      notFound()
    }

    if (!coloringPage) {
      notFound()
    }

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Редактировать страницу раскраски</h1>
        <ColoringPageForm coloringPage={coloringPage} />
      </div>
    )
  } catch (error) {
    console.error("Error in EditColoringPagePage:", error)
    notFound()
  }
}
