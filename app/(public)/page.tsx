import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { LatestBlogPosts } from "@/components/latest-blog-posts"
import { LatestProducts } from "@/components/latest-products"
import { FeaturedColoringPages } from "@/components/featured-coloring-pages"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  // Check if we have any featured coloring pages
  const { count } = await supabase
    .from("coloring_pages")
    .select("*", { count: "exact", head: true })
    .eq("is_featured", true)

  const hasColoringPages = count && count > 0

  return (
    <>
      <section className="w-full py-12 md:py-24 flex items-center justify-center bg-gradient-to-b from-accent to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Beautiful Coloring Pages for Everyone
            </h1>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Products</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
              Discover our collection of high-quality products
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <LatestProducts />
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-background border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Latest Articles</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
              Read our latest articles and stay updated
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <LatestBlogPosts />
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coloring Pages Section */}
      {hasColoringPages && (
        <section className="py-16 bg-background border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Coloring Pages</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
                Our hand-picked selection of the most beautiful and popular coloring pages
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <FeaturedColoringPages />
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/featured">
                <Button variant="outline" size="lg">
                  View All Coloring Pages
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
