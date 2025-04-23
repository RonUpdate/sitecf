import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Debug Routes</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Admin Routes</h2>
          <div className="space-y-2">
            <div>
              <Link href="/admin">
                <Button variant="outline" className="mr-2">
                  Dashboard
                </Button>
              </Link>
              <span className="text-sm text-gray-500">/admin</span>
            </div>
            <div>
              <Link href="/admin/categories">
                <Button variant="outline" className="mr-2">
                  Categories
                </Button>
              </Link>
              <span className="text-sm text-gray-500">/admin/categories</span>
            </div>
            <div>
              <Link href="/admin/categories/new">
                <Button variant="outline" className="mr-2">
                  New Category
                </Button>
              </Link>
              <span className="text-sm text-gray-500">/admin/categories/new</span>
            </div>
            <div>
              <Link href="/admin/products">
                <Button variant="outline" className="mr-2">
                  Products
                </Button>
              </Link>
              <span className="text-sm text-gray-500">/admin/products</span>
            </div>
            <div>
              <Link href="/admin/products/new">
                <Button variant="outline" className="mr-2">
                  New Product
                </Button>
              </Link>
              <span className="text-sm text-gray-500">/admin/products/new</span>
            </div>
            <div>
              <Link href="/admin/coloring-pages">
                <Button variant="outline" className="mr-2">
                  Coloring Pages
                </Button>
              </Link>
              <span className="text-sm text-gray-500">/admin/coloring-pages</span>
            </div>
            <div>
              <Link href="/admin/coloring-pages/new">
                <Button variant="outline" className="mr-2">
                  New Coloring Page
                </Button>
              </Link>
              <span className="text-sm text-gray-500">/admin/coloring-pages/new</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
