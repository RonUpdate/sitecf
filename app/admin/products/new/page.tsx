import { ProductForm } from "@/components/product-form"
import { requireAdmin } from "@/lib/auth-utils"

export default async function NewProductPage() {
  // Ensure the user is authenticated and has admin privileges
  await requireAdmin()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Добавить новый товар</h1>
      <ProductForm />
    </div>
  )
}
