import { UnifiedProductForm } from "@/components/unified-product-form"

export default function CreateColoringPagePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Добавить новую страницу раскраски</h1>
      <UnifiedProductForm
        type="coloringPage"
        backUrl="/admin/coloring-pages"
        backLabel="Назад к страницам раскраски"
        successUrl="/admin/coloring-pages"
      />
    </div>
  )
}
