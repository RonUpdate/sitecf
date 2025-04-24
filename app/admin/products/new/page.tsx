import { UnifiedProductForm } from "@/components/unified-product-form"

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Добавить новый товар</h1>
      <UnifiedProductForm
        type="product"
        backUrl="/admin/products"
        backLabel="Назад к товарам"
        successUrl="/admin/products"
      />
    </div>
  )
}
