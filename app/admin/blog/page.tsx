import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function AdminBlogPage() {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: posts, error } = await supabase.from("blog_posts").select("*")

    if (error) {
      console.error("Error fetching blog posts:", error)
      return (
        <div className="container mx-auto p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Блог-посты</h1>
            <Link href="/admin/blog/new" className="px-4 py-2 bg-blue-600 text-white rounded">
              Добавить пост
            </Link>
          </div>
          <div className="p-4 bg-red-50 text-red-600 rounded">
            Ошибка загрузки постов. Пожалуйста, попробуйте позже.
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Блог-посты</h1>
          <Link href="/admin/blog/new" className="px-4 py-2 bg-blue-600 text-white rounded">
            Добавить пост
          </Link>
        </div>

        {posts && posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="p-4 border rounded">
                <div className="font-bold">{post.title}</div>
                <div className="text-sm text-gray-500">{post.created_at}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет постов.</p>
        )}
      </div>
    )
  } catch (error) {
    console.error("Unhandled error in blog page:", error)
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Произошла ошибка</h1>
        <p>Не удалось загрузить страницу блога. Пожалуйста, попробуйте позже.</p>
        <Link href="/admin" className="text-blue-600 hover:underline">
          Вернуться в админ-панель
        </Link>
      </div>
    )
  }
}
