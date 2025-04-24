"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, X, SortAsc, SortDesc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type FilterOption = {
  id: string
  label: string
  options?: { value: string; label: string }[]
  type: "select" | "boolean" | "range" | "date"
}

type SortOption = {
  id: string
  label: string
  direction?: "asc" | "desc"
}

type AdminFilterBarProps = {
  title: string
  filterOptions?: FilterOption[]
  sortOptions?: SortOption[]
  onSearch: (query: string) => void
  onFilter: (filters: Record<string, any>) => void
  onSort: (sort: { field: string; direction: "asc" | "desc" }) => void
}

export function AdminFilterBar({
  title,
  filterOptions = [],
  sortOptions = [],
  onSearch,
  onFilter,
  onSort,
}: AdminFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [activeSort, setActiveSort] = useState<{ field: string; direction: "asc" | "desc" } | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Handle search input
  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value }
    setActiveFilters(newFilters)
    onFilter(newFilters)
  }

  // Handle sort changes
  const handleSortChange = (sortId: string) => {
    // If already sorting by this field, toggle direction
    if (activeSort?.field === sortId) {
      const newDirection = activeSort.direction === "asc" ? "desc" : "asc"
      setActiveSort({ field: sortId, direction: newDirection })
      onSort({ field: sortId, direction: newDirection })
    } else {
      // Default to ascending for new sort field
      setActiveSort({ field: sortId, direction: "asc" })
      onSort({ field: sortId, direction: "asc" })
    }
  }

  // Remove a filter
  const removeFilter = (filterId: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[filterId]
    setActiveFilters(newFilters)
    onFilter(newFilters)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({})
    onFilter({})
  }

  // Get label for a filter value
  const getFilterValueLabel = (filterId: string, value: any): string => {
    const filter = filterOptions.find((f) => f.id === filterId)
    if (!filter) return String(value)

    if (filter.type === "boolean") {
      return value ? "Да" : "Нет"
    }

    if (filter.options) {
      const option = filter.options.find((o) => o.value === value)
      return option ? option.label : String(value)
    }

    return String(value)
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-8"
            />
          </div>
          <Button onClick={handleSearch} size="sm">
            Найти
          </Button>
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Фильтры
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Фильтры</h3>
                {filterOptions.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <label className="text-sm font-medium">{filter.label}</label>
                    {filter.type === "select" && filter.options && (
                      <Select
                        value={activeFilters[filter.id] || ""}
                        onValueChange={(value) => handleFilterChange(filter.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все</SelectItem>
                          {filter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {filter.type === "boolean" && (
                      <Select
                        value={activeFilters[filter.id]?.toString() || ""}
                        onValueChange={(value) => {
                          if (value === "") {
                            handleFilterChange(filter.id, undefined)
                          } else {
                            handleFilterChange(filter.id, value === "true")
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все</SelectItem>
                          <SelectItem value="true">Да</SelectItem>
                          <SelectItem value="false">Нет</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
                <Separator />
                <h3 className="font-medium">Сортировка</h3>
                <div className="space-y-2">
                  <Select value={activeSort?.field || ""} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Сортировать по..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">По умолчанию</SelectItem>
                      {sortOptions.map((sort) => (
                        <SelectItem key={sort.id} value={sort.id}>
                          {sort.label} {activeSort?.field === sort.id && (activeSort.direction === "asc" ? "↑" : "↓")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {activeSort && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Направление:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newDirection = activeSort.direction === "asc" ? "desc" : "asc"
                          setActiveSort({ ...activeSort, direction: newDirection })
                          onSort({ ...activeSort, direction: newDirection })
                        }}
                      >
                        {activeSort.direction === "asc" ? (
                          <SortAsc className="h-4 w-4 mr-1" />
                        ) : (
                          <SortDesc className="h-4 w-4 mr-1" />
                        )}
                        {activeSort.direction === "asc" ? "По возрастанию" : "По убыванию"}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    disabled={Object.keys(activeFilters).length === 0 && !activeSort}
                  >
                    Сбросить все
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active filters display */}
      {(Object.keys(activeFilters).length > 0 || activeSort) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Активные фильтры:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filterOptions.find((f) => f.id === key)
            if (!filter || value === undefined) return null

            return (
              <Badge key={key} variant="outline" className="flex items-center gap-1">
                {filter.label}: {getFilterValueLabel(key, value)}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter(key)}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              </Badge>
            )
          })}
          {activeSort && (
            <Badge variant="outline" className="flex items-center gap-1">
              Сортировка: {sortOptions.find((s) => s.id === activeSort.field)?.label || activeSort.field}
              {activeSort.direction === "asc" ? " (по возр.)" : " (по убыв.)"}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setActiveSort(null)
                  onSort({ field: "", direction: "asc" })
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove sort</span>
              </Button>
            </Badge>
          )}
          {(Object.keys(activeFilters).length > 0 || activeSort) && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={clearAllFilters}>
              Очистить все
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
