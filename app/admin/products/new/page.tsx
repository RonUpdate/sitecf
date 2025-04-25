// Удаляем импорт generateMetadata или Metadata, если они есть
import { ProductForm } from "@/components/product-form"

export default function NewProductPage() {
  // Код страницы...
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
      <ProductForm />
    </div>
  )
}
