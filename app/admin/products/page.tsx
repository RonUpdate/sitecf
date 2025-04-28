import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function AdminProductsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: products } = await supabase.from("products").select("*")

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-blue-600 text-white rounded">
          Добавить товар
        </Link>
      </div>

      {products && products.length > 0 ? (
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id} className="p-4 border rounded">
              <div className="font-bold">{product.name}</div>
              <div>Цена: {product.price}₽</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет товаров.</p>
      )}
    </div>
  )
}
