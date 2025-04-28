import { BlogPostForm } from "@/components/blog-post-form"

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Добавить новую статью</h1>
      <BlogPostForm />
    </div>
  )
}
