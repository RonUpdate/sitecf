import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Palette, Download } from "lucide-react"
import { SearchForm } from "@/components/search-form"
import { CategoryGrid } from "@/components/category-grid"

export default function Home() {
  return (
    <>
      <section className="py-12 md:py-20 bg-gradient-to-b from-accent to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <Palette className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Beautiful Coloring Pages for Everyone
            </h1>
            <p className="max-w-[700px] text-gray-500 text-sm md:text-base lg:text-xl dark:text-gray-400">
              Discover a world of creativity with our premium coloring pages from Creative Factory
            </p>
            <div className="w-full max-w-md mx-auto mt-4 md:mt-6 mb-4 md:mb-6 px-4 sm:px-0">
              <SearchForm />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-8 w-full sm:w-auto">
              <Link href="/categories" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full">
                  <Palette className="w-5 h-5" />
                  Browse Categories
                </Button>
              </Link>
              <Link href="/featured" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="gap-2 w-full">
                  <Download className="w-5 h-5" />
                  Featured Pages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-2 md:mb-4">Popular Categories</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px] text-sm md:text-base">
              Explore our most popular coloring page categories
            </p>
          </div>
          <CategoryGrid limit={6} />
          <div className="flex justify-center mt-8 md:mt-12">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
