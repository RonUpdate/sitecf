"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-primary" onClick={() => setOpen(false)}>
              Art Market
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Закрыть меню</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            <Link href="/categories" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Coloring Pages
              </Button>
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Blog
              </Button>
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
