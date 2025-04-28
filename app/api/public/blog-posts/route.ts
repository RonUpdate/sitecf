import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "3")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // This query runs server-side with service role permissions
    // which bypasses RLS policies
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, content, excerpt, featured_image, published, published_at, created_at, author_id, author",
      )
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Server error fetching blog posts:", error)
      return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
