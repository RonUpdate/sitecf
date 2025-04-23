import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  // Если всего одна страница, не показываем пагинацию
  if (totalPages <= 1) {
    return null
  }

  // Определяем, какие страницы показывать
  const pageNumbers = []
  const maxPagesToShow = 5

  if (totalPages <= maxPagesToShow) {
    // Если страниц мало, показываем все
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    // Иначе показываем текущую страницу и несколько соседних
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = startPage + maxPagesToShow - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    // Добавляем первую страницу и многоточие, если нужно
    if (startPage > 1) {
      pageNumbers.push(1)
      if (startPage > 2) {
        pageNumbers.push("...")
      }
    }

    // Добавляем страницы в диапазоне
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Добавляем последнюю страницу и многоточие, если нужно
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }
      pageNumbers.push(totalPages)
    }
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button variant="outline" size="icon" disabled={currentPage === 1} asChild={currentPage !== 1}>
        {currentPage === 1 ? (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        ) : (
          <Link href={`${basePath}?page=${currentPage - 1}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2">
              ...
            </span>
          )
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            asChild={currentPage !== page}
          >
            {currentPage === page ? <span>{page}</span> : <Link href={`${basePath}?page=${page}`}>{page}</Link>}
          </Button>
        )
      })}

      <Button variant="outline" size="icon" disabled={currentPage === totalPages} asChild={currentPage !== totalPages}>
        {currentPage === totalPages ? (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link href={`${basePath}?page=${currentPage + 1}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </div>
  )
}
