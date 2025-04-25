"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { Skeleton } from "@/components/ui/skeleton"

export function ColoringPagesTable() {
  const [coloringPages, setColoringPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  useEffect(() => {
    async function fetchColoringPages() {
      const supabase = createClientComponentClient<Database>()

      const { data } = await supabase
        .from("coloring_pages")
        .select(`
          *,
          categories:category_id (
            name
          )
        `)
        .order("created_at", { ascending: false })

      setColoringPages(data || [])
      setLoading(false)
    }

    fetchColoringPages()
  }, [])

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    if (selectedRows.length === coloringPages.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(coloringPages.map((page) => page.id))
    }
  }

  if (loading) {
    return <Skeleton className="h-[500px] w-full" />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedRows.length === coloringPages.length && coloringPages.length > 0}
                onCheckedChange={toggleAllRows}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Загрузки</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coloringPages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Раскраски не найдены
              </TableCell>
            </TableRow>
          ) : (
            coloringPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(page.id)}
                    onCheckedChange={() => toggleRow(page.id)}
                    aria-label={`Select ${page.title}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>{page.categories?.name || "Без категории"}</TableCell>
                <TableCell>{page.price ? `${page.price} ₽` : "Бесплатно"}</TableCell>
                <TableCell>{page.download_count || 0}</TableCell>
                <TableCell>
                  {page.is_featured && <Badge className="mr-1">Избранное</Badge>}
                  {page.is_published ? (
                    <Badge variant="outline" className="bg-green-50">
                      Опубликовано
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50">
                      Черновик
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Открыть меню</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/coloring-pages/${page.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Редактировать
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
