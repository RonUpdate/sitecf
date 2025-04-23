import { notFound } from "next/navigation"
import { CategoryForm } from "@/components/category-form"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerSupabaseClient()

  const { data: category, error } = await supabase.from("categories").select("*").eq("id", params.id).single()

  if (error || !category) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  )
}
