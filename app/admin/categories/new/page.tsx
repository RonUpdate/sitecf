import { CategoryForm } from "@/components/category-form"
import { requireAdmin } from "@/lib/auth-utils"

export default async function NewCategoryPage() {
  // Ensure the user is an admin before rendering this page
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Category</h1>
      </div>
      <div className="border rounded-lg p-6 bg-white">
        <CategoryForm />
      </div>
    </div>
  )
}
