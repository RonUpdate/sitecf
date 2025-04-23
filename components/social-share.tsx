"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SocialShareProps {
  url: string
  title: string
}

export function SocialShare({ url, title }: SocialShareProps) {
  const { toast } = useToast()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: "Ссылка скопирована",
          description: "Ссылка на статью скопирована в буфер обмена.",
        })
      },
      (err) => {
        console.error("Не удалось скопировать ссылку: ", err)
        toast({
          title: "Ошибка",
          description: "Не удалось скопировать ссылку.",
          variant: "destructive",
        })
      },
    )
  }

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    openShareWindow(shareUrl)
  }

  const shareOnTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    openShareWindow(shareUrl)
  }

  const shareOnLinkedin = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    openShareWindow(shareUrl)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="icon" onClick={shareOnFacebook} title="Поделиться в Facebook">
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Facebook</span>
      </Button>
      <Button variant="outline" size="icon" onClick={shareOnTwitter} title="Поделиться в Twitter">
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Twitter</span>
      </Button>
      <Button variant="outline" size="icon" onClick={shareOnLinkedin} title="Поделиться в LinkedIn">
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">LinkedIn</span>
      </Button>
      <Button variant="outline" size="icon" onClick={handleCopyLink} title="Копировать ссылку">
        <Link2 className="h-4 w-4" />
        <span className="sr-only">Копировать ссылку</span>
      </Button>
    </div>
  )
}
