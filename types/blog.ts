export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  author: string
}

export type BlogCategory = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type BlogTag = {
  id: string
  name: string
  slug: string
  created_at: string
}
