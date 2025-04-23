import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ColoringPagesTable } from "@/components/coloring-pages-table"
import { TableExistenceChecker } from "@/components/table-existence-checker"

export default function ColoringPagesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Страницы раскраски</h1>
        <Link href="/admin/coloring-pages/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить страницу
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <TableExistenceChecker />
      </div>

      <ColoringPagesTable />
    </div>
  )
}
