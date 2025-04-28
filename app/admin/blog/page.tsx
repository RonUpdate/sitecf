import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BlogPostsTable } from "@/components/blog-posts-table"

export default function BlogPostsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Статьи блога</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить статью
          </Button>
        </Link>
      </div>

      <BlogPostsTable />
    </div>
  )
}
