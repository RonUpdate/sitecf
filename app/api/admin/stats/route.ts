import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user is authenticated
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get stats data
    const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact", head: true })
    const { count: coloringPagesCount } = await supabase
      .from("coloring_pages")
      .select("*", { count: "exact", head: true })
    const { data: downloadData } = await supabase.from("coloring_pages").select("download_count")
    const totalDownloads = downloadData?.reduce((sum, item) => sum + (item.download_count || 0), 0) || 0

    return NextResponse.json({
      categoryCount,
      coloringPagesCount,
      totalDownloads,
    })
  } catch (error) {
    console.error("Error in stats API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
