"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, X, TagIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

type Tag = {
  id: string
  name: string
  slug: string
}

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (selectedTags: string[]) => void
  className?: string
}

export function TagSelector({ selectedTags, onChange, className }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [showNewTagInput, setShowNewTagInput] = useState(false)

  const supabase = getSupabaseClient()
  const { toast } = useToast()

  // Загрузка тегов при монтировании компонента
  useEffect(() => {
    fetchTags()
  }, [])

  // Загрузка тегов из базы данных
  const fetchTags = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.from("blog_tags").select("*").order("name", { ascending: true })

      if (error) throw error

      setTags(data || [])
    } catch (error: any) {
      console.error("Error fetching tags:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить теги",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Создание нового тега
  const createNewTag = async () => {
    if (!newTagName.trim()) return

    try {
      setLoading(true)

      // Генерируем slug из названия
      const slug = newTagName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")

      // Проверяем уникальность slug
      const { data: existingTag, error: checkError } = await supabase
        .from("blog_tags")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingTag) {
        toast({
          title: "Ошибка",
          description: "Тег с таким slug уже существует",
          variant: "destructive",
        })
        return
      }

      // Создаем новый тег
      const { data, error } = await supabase.from("blog_tags").insert({ name: newTagName, slug }).select().single()

      if (error) throw error

      // Обновляем список тегов
      setTags([...tags, data])

      // Добавляем новый тег к выбранным
      onChange([...selectedTags, data.id])

      // Сбрасываем состояние
      setNewTagName("")
      setShowNewTagInput(false)

      toast({
        title: "Успех",
        description: `Тег "${newTagName}" успешно создан`,
      })
    } catch (error: any) {
      console.error("Error creating tag:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать тег",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Удаление тега из выбранных
  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter((id) => id !== tagId))
  }

  // Получение имени тега по ID
  const getTagName = (tagId: string) => {
    return tags.find((tag) => tag.id === tagId)?.name || "Неизвестный тег"
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 ? (
          selectedTags.map((tagId) => (
            <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
              <TagIcon className="h-3 w-3" />
              {getTagName(tagId)}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeTag(tagId)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Удалить тег</span>
              </Button>
            </Badge>
          ))
        ) : (
          <div className="text-sm text-gray-500">Теги не выбраны</div>
        )}
      </div>

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
              Выбрать теги
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput placeholder="Поиск тегов..." />
              <CommandList>
                <CommandEmpty>
                  {loading ? (
                    <div className="py-6 text-center text-sm">Загрузка тегов...</div>
                  ) : (
                    <div className="py-6 text-center text-sm">
                      Теги не найдены
                      <Button variant="link" className="mt-2 w-full" onClick={() => setShowNewTagInput(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Создать новый тег
                      </Button>
                    </div>
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => {
                        onChange(
                          selectedTags.includes(tag.id)
                            ? selectedTags.filter((id) => id !== tag.id)
                            : [...selectedTags, tag.id],
                        )
                      }}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0")}
                      />
                      <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {tag.name}
                    </CommandItem>
                  ))}
                  {!loading && (
                    <CommandItem
                      value="__create_new_tag__"
                      onSelect={() => setShowNewTagInput(true)}
                      className="text-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Создать новый тег
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {showNewTagInput && (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Название нового тега"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  createNewTag()
                } else if (e.key === "Escape") {
                  setShowNewTagInput(false)
                  setNewTagName("")
                }
              }}
            />
            <Button variant="default" size="icon" onClick={createNewTag} disabled={loading || !newTagName.trim()}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowNewTagInput(false)
                setNewTagName("")
              }}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
