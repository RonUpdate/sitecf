import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient()

  // Get counts
  const { count: usersCount } = await supabase.from("admin_users").select("*", { count: "exact", head: true })

  const { count: postsCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true })

  const { count: categoriesCount } = await supabase.from("blog_categories").select("*", { count: "exact", head: true })

  const { count: tagsCount } = await supabase.from("blog_tags").select("*", { count: "exact", head: true })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{usersCount}</p>
            <p className="text-sm text-muted-foreground mt-2">
              <a href="/admin/users" className="text-blue-600 hover:underline">
                Manage Users
              </a>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{postsCount}</p>
            <p className="text-sm text-muted-foreground mt-2">
              <a href="/admin/blog/posts" className="text-blue-600 hover:underline">
                Manage Posts
              </a>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{categoriesCount}</p>
            <p className="text-sm text-muted-foreground mt-2">
              <a href="/admin/blog/categories" className="text-blue-600 hover:underline">
                Manage Categories
              </a>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tagsCount}</p>
            <p className="text-sm text-muted-foreground mt-2">
              <a href="/admin/blog/tags" className="text-blue-600 hover:underline">
                Manage Tags
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
